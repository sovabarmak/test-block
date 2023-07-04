/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls} from '@wordpress/block-editor';
import {TextControl,CheckboxControl,Spinner} from '@wordpress/components';
import { useState } from '@wordpress/element';

import { useSelect,useDispatch  } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
 
 
function TaxesRow({tax,curTypes,attr,setAttr}){
	if(curTypes.filter(value => tax.types.includes(value)).length ==0)
		return;
	console.log(attr);
	let curTerms= attr.terms;
	return(
		<div className="tax-row">
			<label className="tax-name">{tax.name}</label>
			<div className="tax-terms">
			{tax.terms.map((item,index)=>
				<CheckboxControl  
				label={item.name} 
				value={item.id}
				key={index}
				onChange={(checked)=>{
					curTerms = curTerms.filter( value => value !== item.id )
					if( checked) {
						curTerms.push( item.id );
					}
					setAttr({terms:curTerms});
				}} 
				checked={curTerms.includes( item.id ) ? true : false }
				/>
			)}
			</div>
		</div>
	)
}
function TaxesRows({types,curTypes,attr,setAttr}){

	const {tempTaxes,hasResolved} = useSelect(
		(select) =>{
			return {
				tempTaxes: select(coreStore).getTaxonomies(),
				hasResolved: select(coreStore).hasFinishedResolution('getTaxonomies')
			}
		}
	);
	const postTypesAr=[];
	types.map((item,index)=>{
		postTypesAr[index] = item.value;
	});
	const termsResolved = [];
	let i = 0;
	const taxes = tempTaxes.
		filter((tax)=>{
			let check = false;
			tax.types.map((t)=>{
				if(postTypesAr.indexOf(t) > -1){
					check  = true;
				}
			});
			return check;			
		}).map(
			(tax)=>
			{
				const {terms,resolved} = useSelect( 
					( select ) =>{
						return {
							terms:select( 'core' ).getEntityRecords('taxonomy',tax.slug, { hide_empty:true, per_page: -1, orderby: 'name', order: 'asc', _fields: 'id,name,slug,count' }),
							resolved:select(coreStore).hasFinishedResolution('getEntityRecords',['taxonomy',tax.slug, { hide_empty:true, per_page: -1, orderby: 'name', order: 'asc', _fields: 'id,name,slug,count' }])
						}
					}
				)
				return {
					name:tax.name,
					types:tax.types,
					slug:tax.slug,
					terms: terms,
					resolved:resolved
				}
			}
		).filter(
			tax => tax.terms && tax.terms.length > 0
		)
	
	if ( ! hasResolved ) {
		return <Spinner />;
	}
	for(let i=0;i<taxes;i++){
		if(!taxes[i].resolved)
			return <Spinner />;
	}
	return (
		<>
		{taxes.map((tax,index)=>
				<TaxesRow  tax={tax} curTypes={curTypes} key={index}  attr={attr} setAttr={setAttr} />
		)}
		</>
	);
	
}
 
function MyCheckboxControl2({attributes,setPostType}){
	
	let curPostTypes= attributes.postType;
	
	const {allPostTypes, hasResolved} = useSelect(
		(select) => {
			return {
				allPostTypes: select(coreStore).getPostTypes({ per_page: -1 }),
				hasResolved: select(coreStore).hasFinishedResolution('getPostTypes',[{ per_page: -1 }])
			};
		}
	);

	const postTypes = !Array.isArray(allPostTypes) ? [] : allPostTypes
		.filter(
			postType => postType.viewable == true && postType.slug !='attachment')
		.map(
			(postType) => ({
				label: postType.labels.singular_name,
				value: postType.slug
			})
		);
	
	if ( ! hasResolved ) {
		return <Spinner />;
	}
	return (
	<>
	{postTypes.map((item, index) =>
			 <CheckboxControl  
				label={item.label} 
				onChange={(checked)=>{
					curPostTypes = curPostTypes.filter( value => value !== item.value )
					if( checked) {
						curPostTypes.push( item.value );
					}
					setPostType({postType:curPostTypes});
				}} 
				value={item.value}
				checked={curPostTypes.includes( item.value ) ? true : false }
				key={index}
				/>
	)}
	<TaxesRows types={postTypes} curTypes={curPostTypes} attr={attributes} setAttr={setPostType} />
	</>
	);
};
export default function Edit({attributes,setAttributes}) {


	return (
		<p { ...useBlockProps() }>
			<InspectorControls key="setting">
				<TextControl className="blocks-basecontrol_input"
					label ={"Mess"}
					value={ attributes.message }
					onChange={ ( val ) => setAttributes( { message: val } ) }
				/>
				<TextControl className="blocks-basecontrol_input"
					label ={"Mess 2"}
					value={ attributes.message2 }
					onChange={ ( val ) => setAttributes( { message2: val } ) }
				/>
				<MyCheckboxControl2 attributes={attributes} setPostType={setAttributes} />
			</InspectorControls>
			Test mes:  { attributes.message }
			<br /> Mess2:  { attributes.message2 }
		</p>
	);
}

