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
import {TextControl,CheckboxControl} from '@wordpress/components';
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
 
function MyCheckboxControl2({attributes,setPostType}){
	const { postType } = attributes;
	
	let curPostTypes= attributes.postType;
    const allPostTypes = useSelect(
        (select) => select(coreStore).getPostTypes({ per_page: -1 }), []
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
	let taxes=[];
	let postTypeTaxes=[];
	
    return (
		postTypes.map((item, index) =>
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
				/>
		)
    );
};
export default function Edit({attributes,setAttributes}) {
	const [ isChecked, setChecked ] = useState( true );
	
const MyCheckboxControl = () => {
    const [ isChecked, setChecked ] = useState( true );
    return (
        <CheckboxControl
            label="Is author"
            help="Is the user a author or not?"
            checked={ isChecked }
            onChange={ setChecked }
        />
    );
};

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
				<MyCheckboxControl />
				<MyCheckboxControl2 attributes={attributes} setPostType={setAttributes} />
			
			
			</InspectorControls>
			{ __( 'Test – hello from the test editor!', 'test' ) } 
			Test mes:  { attributes.message }
			<br /> Mess2:  { attributes.message2 }
		</p>
					
	);
}

