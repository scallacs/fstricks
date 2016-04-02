<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Freestyle Tricks Administration</title>
        <?= $this->Html->script('components/ng-admin/build/ng-admin.min.js'); ?>
        <?= $this->Html->css('/js/components/ng-admin/build/ng-admin.min.css'); ?>

        <script type="text/javascript">
            var ADMIN_API_BASE_URL = '<?= \Cake\Routing\Router::url('/admin/api/', true); ?>';
            var myApp = angular.module('app.admin', ['ng-admin']);
// declare a function to run when the module bootstraps (during the 'config' phase)
            myApp.config(['NgAdminConfigurationProvider', function(nga) {
                    // create an admin application
                    var admin = nga.application('Freestyle Tricks Admin')
                            .baseApiUrl(ADMIN_API_BASE_URL); // main API endpoint;
                    // more configuration here later
                    var user = nga.entity('users');
                    // set the fields of the user entity list view
                    user.listView()
                            .fields([
                                nga.field('username').isDetailLink(true),
                                nga.field('email'),
                                nga.field('status'),
                                nga.field('created', 'datetime'),
                                nga.field('last_login', 'datetime')
//                                nga.field('id', 'reference')
//                                    .targetEntity(user)
//                                    .targetField(nga.field('username'))
//                                    .label('Author')
                            ])
                            .listActions(['show'])
                            .batchActions([]);
                    user.showView()
                            .fields([
                                nga.field('id'),
                                nga.field('username'),
                                nga.field('email'),
                                nga.field('status'),
                                nga.field('created', 'datetime'),
                                nga.field('last_login', 'datetime')
                            ]);
                    // add the user entity to the admin application
                    admin.addEntity(user);

                    var category = nga.entity('categories');
                    var sport = nga.entity('sports');
                    
                    category
                            .listView()
                            .fields([
                                nga.field('id'),
                                nga.field('name').isDetailLink(true),
                                nga.field('status'),
                                nga.field('sport_id', 'reference')
                                        .targetEntity(sport)
                                        .targetField(nga.field('name'))
                                        .label('Sport')
                            ]);
                    admin.addEntity(category);
                    
                    sport
                            .listView()
                            .fields([
                                nga.field('id'),
                                nga.field('image', 'file'),
                                nga.field('name').isDetailLink(true),
                                nga.field('status')
                            ]);
                    sport.showView()
                            .fields([
                                nga.field('id'),
                                nga.field('name'),
                                nga.field('categories', 'referenced_list')
                                    .targetEntity(category)
                                    .targetReferenceField('sport_id')
                                    .targetFields([
                                        nga.field('name')
                                    ])
                                    .sortField('id')
                                    .sortDir('DESC')
                            ]);

                    sport.creationView().fields([
                        nga.field('name')
                                .validation({required: true, minlength: 2, maxlength: 25}),
                        nga.field('status')
                                .validation({required: true, minlength: 2, maxlength: 25}),
                    ]);
                            
                    admin.addEntity(sport);
                    
                    // ---------------------------------------------------------
                    var video = nga.entity('videos');
                    video
                            .listView()
                            .fields([
                                nga.field('id'),
                                nga.field('video_url'),
                                nga.field('duration'),
                                nga.field('status'),
                                nga.field('provider_id')
                            ])
                            .listActions(['show'])
                            .batchActions(['delete'])
                            .filters([
                                nga.field('status', 'choice')
                                    .choices([
                                        { label: 'public', value: 'public' }, 
                                        { label: 'private', value: 'private' }
                                    ])
                                    .label('Status')
                                    .pinned(true),
                                nga.field('provider_id', 'choice')
                                    .choices([
                                        { label: 'vimeo', value: 'vimeo' }, 
                                        { label: 'youtube', value: 'youtube' }
                                    ])
                                    .label('Provider')
                                    .pinned(true)
                            ]);
                    video.showView()
                            .fields([
                                nga.field('id'),
                                nga.field('video_url'),
                                nga.field('duration'),
                                nga.field('status'),
                                nga.field('provider_id')
                            ]);
                    admin.addEntity(video);
                    // ---------------------------------------------------------
                            

                    // set the fields of the user entity list view
                    var tag = nga.entity('tags');
                    tag
                            .listView()
                            .fields([
                                nga.field('name'),
                                nga.field('category_id', 'reference')
                                        .targetEntity(category)
                                        .targetField(nga.field('name'))
                                        .label('Category')
                            ])
                            .listActions(['show', 'edit', 'delete'])
                            .batchActions(['delete'])
                            .filters([
                                nga.field('name')
                                        .label('Full-Text')
                                        .pinned(true)
                            ]);
                    tag.showView()
                            .fields([
                                nga.field('id'),
                                nga.field('username'),
                                nga.field('email'),
                                nga.field('status'),
                                nga.field('created', 'datetime'),
                                nga.field('last_login', 'datetime')
                            ]);
                    // add the user entity to the admin application
                    admin.addEntity(tag);

                    // ---------------------------------------------------------
                    

                    var reportError = nga.entity('report-errors');
                    // set the fields of the user entity list view
                    reportError.listView()
                            .fields([
                                nga.field('status'),
                                nga.field('description', 'text'),
                                nga.field('created', 'datetime'),
                                nga.field('modified', 'datetime')
                            ])
                            .filters([
                                nga.field('status', 'choices')
                                    .choices([
                                        { label: 'accepted', value: 'accepted' }, 
                                        { label: 'rejected', value: 'rejected' }, 
                                        { label: 'pending', value: 'pending' }
                                    ])
                                    .label('status')
                                    .pinned(true),
                            ])
                            .listActions(['show'])
                            .batchActions([]);
                    reportError.showView()
                            .fields([
                                nga.field('id'),
                                nga.field('username'),
                                nga.field('email'),
                                nga.field('status'),
                                nga.field('created', 'datetime'),
                                nga.field('last_login', 'datetime')
                            ]);
                    // add the user entity to the admin application
                    admin.addEntity(reportError);

                    // ---------------------------------------------------------
                    
                    var rider = nga.entity('riders');
                    // set the fields of the user entity list view
                    rider.listView()
                            .fields([
                                nga.field('id'),
                                nga.field('firstname'),
                                nga.field('lastname'),
                                nga.field('nationality'),
                                nga.field('status'),
                                nga.field('created', 'datetime'),
                                nga.field('modified', 'datetime'),
                                nga.field('sexe')
                            ])
                            .listActions(['show', 'edit', 'delete'])
                            .batchActions(['edit', 'delete'])
                            .filters([
                                nga.field('q')
                                        .label('Full-Text')
                                        .pinned(true),
                                nga.field('status', 'choices')
                                    .choices([
                                        { label: 'validated', value: 'validated' }, 
                                        { label: 'unknown', value: 'unknown' }, 
                                        { label: 'pending', value: 'pending' }
                                    ])
                                    .label('status')
                                    .pinned(true)
                            ]);


                    rider.creationView().fields([
                        nga.field('firstname')
                                .validation({required: true, minlength: 2, maxlength: 25}),
                        nga.field('lastname')
                                .validation({required: true, minlength: 2, maxlength: 25}),
                        nga.field('nationality')
                                .validation({required: true})
                    ]);
                    rider.editionView().fields(rider.creationView().fields());

                    rider.showView()
                            .fields([
                                nga.field('id'),
                                nga.field('firstname'),
                                nga.field('lastname'),
                                nga.field('nationality'),
                                nga.field('status'),
                                nga.field('created', 'datetime'),
                                nga.field('modified', 'datetime'),
                                nga.field('sexe')
                            ]);
                    admin.addEntity(rider);
                    
                    // ---------------------------------------------------------
                    
                    var feedback = nga.entity('feedbacks');
                    // set the fields of the user entity list view
                    feedback.listView()
                            .fields([
                                nga.field('id'),
                                nga.field('user_id', 'reference')
                                    .targetEntity(user)
                                    .targetField(nga.field('username'))
                                    .label('Author'),
                                nga.field('browser'),
                                nga.field('url'),
                                nga.field('note'),
                                nga.field('status'),
                                nga.field('created', 'datetime'),
                                nga.field('modified', 'datetime')
                            ])
                            .listActions(['show', 'edit', 'delete'])
                            .batchActions(['edit', 'delete'])
                            .filters([
                                nga.field('status', 'choices')
                                        .choices([
                                            { label: 'accepted', value: 'accepted' }, 
                                            { label: 'rejected', value: 'rejected' }, 
                                            { label: 'pending', value: 'pending' }
                                        ])
                                        .label('status')
                                        .pinned(true),
                                nga.field('q')
                                        .label('Full-Text')
                                        .pinned(true)
                            ]);

                    feedback.showView()
                            .fields([
                                nga.field('id'),
                                nga.field('user_id', 'reference')
                                    .targetEntity(user)
                                    .targetField(nga.field('username'))
                                    .label('Author'),
                                nga.field('status', 'text').cssClasses('label label-primary'), 
                                nga.field('created', 'datetime'),
                                nga.field('modified', 'datetime'),
                                nga.field('browser'),
                                nga.field('url'),
                                nga.field('note', 'text'),
                                nga.field('img', 'file'),
                                nga.field('hmtl', 'wysiwyg')
                            ]);
                    admin.addEntity(feedback);
                    // ---------------------------------------------------------

                    var videoTags = nga.entity('video-tags');
                    // set the fields of the user entity list view
                    videoTags.listView()
                            .fields([
                                nga.field('id'),
                                nga.field('status'),
                                nga.field('begin'),
                                nga.field('end'),
                                nga.field('created', 'datetime'),
                                nga.field('modified', 'datetime'),
                                nga.field('rider_id', 'reference')
                                        .targetEntity(rider)
                                        .targetField(nga.field('lastname'))
                                        .label('Rider')
                            ])
                            .listActions(['show'])
                            .batchActions([]);

                    videoTags.showView()
                            .fields([
                                nga.field('id'),
                                nga.field('username'),
                                nga.field('email'),
                                nga.field('status'),
                                nga.field('created', 'datetime'),
                                nga.field('last_login', 'datetime')
                            ]);
                    // add the user entity to the admin application
                    admin.addEntity(videoTags);



                    nga.configure(admin);
                }]);
        </script>
    </head>
    <body ng-app="app.admin">
        <div ui-view></div>
        <script src="admin.js" type="text/javascript"></script>
    </body>
</html>