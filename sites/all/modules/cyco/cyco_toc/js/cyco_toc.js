(function ($) {
  Drupal.behaviors.cycoToc = {
    attach: function (context, settings) {
      var headingTagList 
          = $('.content h1, .content h2, .content h3, .content h4');
      if ( headingTagList.size() > 0 ) {
        var html = '<div id="cyco_toc">'
                    + '<p id="cyco_toc_label">Contents</p>';
        var elementCount = 0;
        headingTagList.each(function(index) {
          var elementHeading = $(this).text();
          var elementTag = this.tagName.toLowerCase();
          $(this).attr('id', 'cyco_toc' + elementCount);
          html += '<p class="cyco_toc_' + elementTag + '"><a href="#cyco_toc' 
                  + elementCount + '">' + elementHeading + '</a></p>';
          elementCount ++;
        }); // end each
        html += '</div>';
        $('div.swim').before(html);
      } // end if
    }
  };
}(jQuery));



