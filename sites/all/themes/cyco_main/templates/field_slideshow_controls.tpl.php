<?php
/**
 * @file
 * Template file for field_slideshow_controls
 *
 *
 */
?>
<div id="field-slideshow-<?php print $slideshow_id; ?>-controls" class="field-slideshow-controls">
  <button type="button" class="btn btn-default btn-lg">
    <a href="#" class="prev"><span title="Previous" class="glyphicon glyphicon-chevron-left"></span></a>
  </button>
  <?php if (!empty($controls_pause)) : ?>
    <a href="#" class="play"><?php print t('Play'); ?></a>
    <a href="#" class="pause"><?php print t('Pause'); ?></a>
  <?php endif; ?>
  <button type="button" class="btn btn-default btn-lg">
    <a href="#" class="next"><span title="Next" class="glyphicon glyphicon-chevron-right"></span></a>
  </button>
</div>
