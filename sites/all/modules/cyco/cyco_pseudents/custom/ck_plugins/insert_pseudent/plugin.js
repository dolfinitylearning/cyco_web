/**
 * @file
 * CK plugin to insert a pseudent into a SWIM editor's content.
 */
(function ($) {
  CKEDITOR.plugins.add('insert_pseudent', {
    requires: 'widget',
    icons: 'insert_pseudent',
    init: function(editor) {
      //Get all the pseudent category terms in use.
      Drupal.settings.pseudents.catTerms = listCategoryTerms();
      //Add a dialog to the plugin.
      CKEDITOR.dialog.add( 'insert_pseudent', this.path + 'dialogs/insert_pseudent.js' );    
      //Define a widget.
      editor.widgets.add('insert_pseudent', {
        dialog: "insert_pseudent",
        button: 'Insert a pseudent',
        template:
              '<div class="pseudent">'
            +   '<div class="pseudent-image-container">'
            +     '<img class="pseudent-image">'
            +     '<div class="pseudent-image-caption">' 
            +     '</div>'
            +   '</div>'
            +   '<div class="pseudent-content">What do I say?</div>'
            + '</div>',
        init: function() {
          //Set up widget data.
          //Get pseudent id from an attr of the outer div.
          //Get the pseudent category the user was selecting from
          //from an attr of the outer div.
          //Image URL and caption text are derived from the pseudent id,
          //when the id is used as an array index.
          var pseudentId = "";
          var $element = $(this.element.$);
          if ( $element.attr("data-pseudent-id") ) {
            pseudentId = $element.attr("data-pseudent-id");
          }
          this.setData( "pseudentId", pseudentId );
          var pseudentCategory = "";
          if ( $element.attr("data-pseudent-category") ) {
            pseudentCategory = $element.attr("data-pseudent-category");
            //Does the category still exist? May have been deleted on the
            //server.
            var found = false;
            $.each(Drupal.settings.pseudents.catTerms, function(index, termData){
              if ( termData.tid == pseudentCategory ) {
                found = true;
              }
            });
            if ( ! found ) {
              pseudentCategory = "";
            }
          }
          this.setData( "pseudentCategory", pseudentCategory );
        },
        data: function() {
          //Use widget data to alter HTML.
          if ( ! this.data.pseudentId ) {
            return;
          }
          //Called when the dialog calls the widget's set data function.
          var $element = $(this.element.$);
          //Store pseudent id as an attribute of the outer div.
          $element.attr( "data-pseudent-id", this.data.pseudentId );
          //Store the URL of the image in the img tag.
          var imageUrl = Drupal.settings.pseudents.posePreviews[ 
              this.data.pseudentId ].url;
          $element.find("img").attr( "src", imageUrl );
          //Add the caption text.
          var caption = Drupal.settings.pseudents.posePreviews[ 
              this.data.pseudentId ].caption;
          $element.find(".pseudent-image-caption").html( caption );
          //Store the category the user selected the pseudent from
          //as an attribute of the outer div.
          $element.attr( "data-pseudent-category", 
            this.data.pseudentCategory );
        },
        editables: {
          content: {
            selector: '.pseudent-content'
          }
        },
        allowedContent:
                'br;'
              + 'img[!src];'
              + 'div(!pseudent)[!data-pseudent-id];'
              + 'div(!pseudent-image-container);'
              + 'div(!pseudent-image);'
              + 'div(!pseudent-image-caption); '
              + 'div(!pseudent-content);',
        requiredContent: 
              'div(pseudent)',
        upcast: function(element) {
          if ( element.name == 'div' ) {
            if ( element.hasClass('pseudent') ) {
              return true;
            }
          }
          return  false;
        }
      });

//      editor.addCommand('insertPseudent', 
//        new CKEDITOR.dialogCommand( 'pseudentDialog' )
//      );

      //Add stylesheet.
      editor.on("instanceReady", function() {
        this.document.appendStyleSheet( Drupal.settings.pseudents.poseStylesheet );
        this.document.appendStyleSheet( Drupal.settings.pseudents.poseStylesheetEdit );
      });

      editor.ui.addButton( 'insert_pseudent', {
          label: 'Insert a pseudent',
          command: 'insert_pseudent',
          state: CKEDITOR.TRISTATE_ENABLED,
          icon : this.path + 'insert_pseudent.png',
          toolbar: 'others'
      });
    }
  });
  
  /**
   * Generate a list of the category terms, for the dialog select.
   * @returns array List of terms in use, indexed by term id.
   */
  function listCategoryTerms() {
    var categoryTerms = new Array();
    //Loop across all poses.
    jQuery.each( Drupal.settings.pseudents.posePreviews, function(poseIndex, previewData) {
      //Get terms for this pose.
      var termsForPreview = previewData.categories;
      //Loop across all terms.
      jQuery.each( termsForPreview, function(termIndex, termData){
        //Is term already in the list?
        var alreadyExists = false;
        for ( var index = 0; index < categoryTerms.length; index++) {
          if ( categoryTerms[index].tid == termIndex ) {
            alreadyExists = true;
            break;
          }
        }
        //Add term, is not already there.
        if ( ! alreadyExists ) {
          var newTermDef = {'tid': termIndex, 'term': termData};
          categoryTerms.push( newTermDef );
        }
      });
    });
    return categoryTerms;
  }
}(jQuery));
