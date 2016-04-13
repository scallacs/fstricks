var glimpse = require('glimpse'),
    onPageDone;

var paths = {
    deployDir: 'www.fstricks.com',
    snapshots: 'webroot/snapshots'
};

//  do something when page is loaded, $ is your jQuery for the page
onPageDone = function(){
   var linkEle = $('link'),
        scriptEle = $('script'),
        metaFragment = $('meta[name=fragment]');

    linkEle.remove();
    scriptEle.remove();
    metaFragment.remove();
};

glimpse({
  //  our static served folder
  folder: paths.deployDir,
  //  which urls to get snapshots of
  urls: [
        '', //  index.html
        '/player/bestof/snowboard',
  ],
  //  where to write the snapshot HTML
  outputDir: paths.snapshots,
  //  if we need apache's modrewrite rules
  modRewrite: [
    '!\\.html|\\.js|\\.css|\\.png$ /index.html [L]'
  ],
  onPageDone: onPageDone,
  //  if we want to reject and XHR calls to 3rd party assets
  rejectExternalSources: true,
  //  see stuff written
  verbose: true
})
//  when done, do something else, you got a promise
.then(function(){
  taskDone();
});