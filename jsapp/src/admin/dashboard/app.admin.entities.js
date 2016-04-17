angular.module('app.admin')
        .config(Config)
        .constant('EntityStatus', {
            VideoTag: [
                {label: 'pending', value: 'pending'},
                {label: 'rejected', value: 'rejected'},
                {label: 'validated', value: 'validated'},
            ],
            User: [
                {label: 'pending', value: 'pending'},
                {label: 'blocked', value: 'blocked'},
                {label: 'validated', value: 'validated'},
            ],
            Video: [
                {label: 'public', value: 'public'},
                {label: 'private', value: 'private'},
            ],
            Tag: [
                {label: 'public', value: 'public'},
                {label: 'private', value: 'private'},
            ],
            Category: [
                {label: 'public', value: 'public'},
                {label: 'private', value: 'private'},
            ],
            Sport: [
                {label: 'public', value: 'public'},
                {label: 'private', value: 'private'},
            ]
        });


Config.$inject = ['NgAdminConfigurationProvider', 'EntityStatus'];
function Config(nga, EntityStatus) {
    var providerChoices = [
        {label: 'vimeo', value: 'vimeo'},
        {label: 'youtube', value: 'youtube'}
    ];
    function cssStatus(entry) {
        if (!entry)
            return;
        var baseClass = 'text-center text-bold';
        var status = entry.values.status;
        if (status === 'accepted' || status === 'validated' || status === 'activated' || status === 'public') {
            return baseClass + ' bg-success';
        }
        if (status === 'rejected' || status === 'blocked' || status === 'private') {
            return baseClass + ' bg-danger';
        }
        if (status === 'pending') {
            return baseClass + ' bg-info';
        }
        return baseClass + ' bg-warning';
    }
    function timeago(value) {
        if (!value) {
            return '';
        }
        return jQuery.timeago(value);
    }

    // create an admin application
    var admin = nga.application('Freestyle Tricks Admin')
            .baseApiUrl(__AdminAPIConfig__.baseUrl); // main API endpoint;
    // -------------------------------------------------------------
    var user = nga.entity('users');
    var tag = nga.entity('tags');
    var sport = nga.entity('sports');
    var category = nga.entity('categories');
    var video = nga.entity('videos');
    var rider = nga.entity('riders');
    var reportError = nga.entity('report-errors');
    var videoTags = nga.entity('video-tags');
    var feedback = nga.entity('feedbacks');

    var quotaType = nga.entity('quota-types');
    quotaType.baseApiUrl(__AdminAPIConfig__.baseUrl + 'activity-quota/');
    var userQuota = nga.entity('user-quotas');
    userQuota.baseApiUrl(__AdminAPIConfig__.baseUrl + 'activity-quota/');



    // -------------------------------------------------------------
    // set the fields of the user entity list view
    userQuota.listView().fields([
        nga.field('quota_type_id', 'reference')
                .targetEntity(quotaType)
                .targetField(nga.field('application_key'))
                .label('Quota Type'),
        nga.field('user_id', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('User'),
        nga.field('last_activity', 'date'),
        nga.field('quota_minute'),
        nga.field('quota_hour'),
        nga.field('quota_day'),
        nga.field('quota_month'),
        nga.field('quota_year'),
        nga.field('quota_overall')
    ])
            .listActions(['show', 'edit', 'delete'])
            .batchActions(['delete']);

    userQuota.creationView()
            .fields([
                nga.field('last_activity', 'number').validation({required: true, min: 0}),
                nga.field('quota_minute', 'number').validation({required: true, min: 0}),
                nga.field('quota_hour', 'number').validation({required: true, min: 0}),
                nga.field('quota_day', 'number').validation({required: true, min: 0}),
                nga.field('quota_month', 'number').validation({required: true, min: 0}),
                nga.field('quota_year', 'number').validation({required: true, min: 0}),
                nga.field('quota_overall', 'number').validation({required: true, min: 0})
            ]);

    userQuota.editionView()
            .fields(userQuota.creationView().fields());
    admin.addEntity(userQuota);

    // -------------------------------------------------------------
    // set the fields of the user entity list view
    quotaType.listView().fields([
        nga.field('application_key'),
        nga.field('description', 'text'),
        nga.field('min_delay'),
        nga.field('quota_minute'),
        nga.field('quota_hour'),
        nga.field('quota_day'),
        nga.field('quota_month'),
        nga.field('quota_year'),
        nga.field('quota_overall')
    ])
            .listActions(['edit', 'delete'])
            .batchActions(['delete']);

    quotaType.creationView()
            .fields([
                nga.field('application_key').validation({required: true}),
                nga.field('description', 'text').validation({required: false}),
                nga.field('min_delay', 'number').validation({required: true, min: 0}),
                nga.field('quota_minute', 'number').validation({required: true, min: 0}),
                nga.field('quota_hour', 'number').validation({required: true, min: 0}),
                nga.field('quota_day', 'number').validation({required: true, min: 0}),
                nga.field('quota_month', 'number').validation({required: true, min: 0}),
                nga.field('quota_year', 'number').validation({required: true, min: 0}),
                nga.field('quota_overall', 'number').validation({required: true, min: 0})
            ]);

    quotaType.editionView()
            .fields(quotaType.creationView().fields());
    admin.addEntity(quotaType);
    // -------------------------------------------------------------

    tag.listView()
            .perPage(15)
            .fields([
//        nga.field('id'),
                nga.field('name').isDetailLink(true),
                nga.field('count_ref'),
                nga.field('slug'),
                nga.field('status', 'choice')
                        .cssClasses(cssStatus),
                nga.field('created', 'datetime')
                        .map(timeago),
                nga.field('sport_id', 'reference')
                        .targetEntity(sport)
                        .targetField(nga.field('name'))
                        .label('Sport'),
                nga.field('category_id', 'reference')
                        .targetEntity(category)
                        .targetField(nga.field('name'))
                        .label('Category')
            ])
            .filters([
                nga.field('q')
                        .label('Full-Text')
                        .pinned(true),
                nga.field('status', 'choice')
                        .choices(EntityStatus.Tag)
                        .label('status')
                        .pinned(true)
            ])
            .listActions([
                'edit',
                'delete',
                '<status-buttons model="tags" entry="entry" status="[\'validated\',\'rejected\',\'pending\',\'blacklist\']"></status-buttons>'
            ])
            .batchActions(['delete']);

    tag.creationView()
            .fields([
                nga.field('name')
                        .validation({required: true}),
                nga.field('slug')
                        .validation({required: false}),
            ]);

    tag.editionView()
            .fields(tag.creationView().fields());
    admin.addEntity(tag);
    // -------------------------------------------------------------

    // set the fields of the user entity list view
    user.listView().fields([
        nga.field('username'),
        nga.field('email'),
        nga.field('status')
                .cssClasses(cssStatus),
        nga.field('provider_id'),
        nga.field('provider_uid'),
        nga.field('created', 'date'),
        nga.field('last_login', 'date')
    ])
            .filters([
                nga.field('q')
                        .label('Full-Text')
                        .pinned(true),
                nga.field('status', 'choice')
                        .choices(EntityStatus.User)
                        .label('status')
                        .pinned(false)
            ])
            .listActions(['show', 'edit'])
            .batchActions(['delete']);
    user.showView().fields([
        nga.field('username'),
        nga.field('email'),
        nga.field('provider_id'),
        nga.field('created', 'date'),
        nga.field('last_login', 'date')
    ]);

    // add the user entity to the admin application
    admin.addEntity(user);

    // ---------------------------------------------------------


    // ---------------------------------------------------------
    sport
            .listView()
            .fields([
                nga.field('status')
                        .cssClasses(cssStatus),
                nga.field('image', 'template')
                        .template('<img ng-src="{{entry.values.slug | sportIconUrl}}" alt="{{entry.values.name}}"/>'),
                nga.field('name').isDetailLink(true),
                nga.field('slug'),
                nga.field('position')
            ])
            .listActions([
                'show', 'edit', 'delete'
            ]);
    sport.showView()
            .fields([
                nga.field('id'),
                nga.field('name'),
                nga.field('slug'),
                nga.field('position'),
                nga.field('categories', 'embedded_list')
                        .targetFields([
                            nga.field('name').isDetailLink(true),
                            nga.field('slug'),
                            nga.field('position', 'number'),
                            nga.field('status', 'choice')
                                    .choices(EntityStatus.Category)
                        ])
                        .listActions([
                            'edit'
                        ])
            ])
            ;

    sport.creationView()
            .fields([
                nga.field('name')
                        .validation({required: true, minlength: 2, maxlength: 25}),
                nga.field('slug')
                        .validation({required: true, minlength: 2, maxlength: 25}),
                nga.field('status', 'choice')
                        .choices(EntityStatus.Sport)
                        .validation({required: true}),
                nga.field('position', 'number')
                        .validation({required: true})
            ]);
    sport.editionView()
            .fields(sport.creationView().fields().concat([
//                nga.field('categories', 'embedded_list')
//                        .targetFields([
//                            nga.field('name')
//                                    .validation({required: true, minlength: 2, maxlength: 25}),
//                            nga.field('slug')
//                                    .validation({required: true, minlength: 2, maxlength: 25}),
//                            nga.field('status', 'choice')
//                                    .choices(EntityStatus.Category)
//                                    .validation({required: true})
//                        ])
            ]));

    admin.addEntity(sport);

    // ---------------------------------------------------------
    video
            .listView()
            .fields([
                nga.field('id'),
                nga.field('video_url'),
                nga.field('duration'),
                nga.field('status')
                        .cssClasses(cssStatus),
                nga.field('provider_id')
            ])
            .listActions([
                'show',
                '<custom-link text="edit tags" entry="entry" url="video-tags/custom-edit"></custom-link>'
            ])
            .batchActions(['delete'])
            .filters([
                nga.field('status', 'choice')
                        .choices(EntityStatus.Video)
                        .label('Status')
                        .pinned(true),
                nga.field('provider_id', 'choice')
                        .choices(providerChoices)
                        .label('Provider')
                        .pinned(true),
                nga.field('min_duration', 'number')
                        .label('Min duration')
                        .pinned(false),
                nga.field('max_duration', 'number')
                        .label('Max duration')
                        .pinned(false)
            ]);
    video.showView()
            .fields([
                nga.field('id'),
                nga.field('video_url'),
                nga.field('duration'),
                nga.field('status')
                        .cssClasses(cssStatus),
                nga.field('provider_id')
            ]);
    video.creationView()
            .fields([,
                nga.field('provider_id', 'choice')
                        .choices(providerChoices)
                        .validation({required: true}),
                nga.field('video_url')
                        .validation({required: true}),
                nga.field('status', 'choice')
                        .validation({required: true})
                        .choices(EntityStatus.Video),
            ]);
    admin.addEntity(video);

    // ---------------------------------------------------------


    // set the fields of the user entity list view
    reportError.listView()
            .fields([
                nga.field('status')
                        .cssClasses(cssStatus),
                nga.field('description', 'text'),
                nga.field('created', 'datetime'),
                nga.field('modified', 'datetime')
            ])
            .filters([
                nga.field('status', 'choices')
                        .choices(EntityStatus.ReportError)
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
                nga.field('status')
                        .cssClasses(cssStatus),
                nga.field('created', 'datetime'),
                nga.field('last_login', 'datetime')
            ]);
    // add the user entity to the admin application
    admin.addEntity(reportError);

    // ---------------------------------------------------------

    // set the fields of the user entity list view
    rider.listView()
            .fields([
                nga.field('id'),
                nga.field('firstname'),
                nga.field('lastname'),
                nga.field('nationality'),
                nga.field('slug'),
                nga.field('status')
                        .cssClasses(cssStatus),
                nga.field('created', 'datetime'),
                nga.field('modified', 'datetime'),
                nga.field('sexe')
            ])
            .listActions([
                'show',
                'edit',
                'delete',
                '<status-buttons model="riders" entry="entry" status="[\'validated\',\'rejected\',\'pending\',\'blacklist\']"></status-buttons>'
            ])
            .batchActions(['edit', 'delete'])
            .filters([
                nga.field('q')
                        .label('Full-Text')
                        .pinned(true),
                nga.field('status', 'choice')
                        .choices(EntityStatus.Rider)
                        .label('status')
                        .pinned(true)
            ]);


    rider.creationView().fields([
        nga.field('firstname')
                .validation({required: true, minlength: 2, maxlength: 25}),
        nga.field('lastname')
                .validation({required: true, minlength: 2, maxlength: 25}),
        nga.field('nationality')
                .validation({required: true}),
        nga.field('status', 'choice')
                .choices(EntityStatus.Rider)
    ]);
    rider.editionView().fields(rider.creationView().fields());

    rider.showView()
            .fields([
                nga.field('id'),
                nga.field('firstname'),
                nga.field('lastname'),
                nga.field('nationality'),
                nga.field('status')
                        .cssClasses(cssStatus),
                nga.field('created', 'datetime'),
                nga.field('modified', 'datetime'),
                nga.field('sexe')
            ]);
    admin.addEntity(rider);

    // ---------------------------------------------------------

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
                nga.field('status')
                        .cssClasses(cssStatus),
                nga.field('created', 'datetime'),
                nga.field('modified', 'datetime')
            ])
            .listActions(['show', 'edit', 'delete'])
            .batchActions(['edit', 'delete'])
            .filters([
                nga.field('status', 'choices')
                        .choices(EntityStatus.Feedback)
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
                nga.field('status')
                        .cssClasses(cssStatus),
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

    // set the fields of the user entity list view
    videoTags.listView()
            .perPage(10)
            .fields([
                nga.field('id'),
                nga.field('status')
                        .cssClasses(cssStatus),
                nga.field('begin', 'number'),
                nga.field('_duration', 'number')
                        .label('Duration')
                        .map(function(val, data) {
                            if (!data)
                                return 0;
                            val = Math.round((data.end - data.begin) * 100.0);
                            return val / 100.0;
                        })
                        .cssClasses(function(entry) {
                            if (!entry)
                                return;
                            if (entry.values._duration <= 2 || entry.values._duration >= 44) {
                                return 'bg-danger';
                            }
                            else {
                                return 'bg-success';
                            }
                        }),
                nga.field('tag.name').label('Tag'),
                nga.field('modified').map(timeago),
                nga.field('video.provider_id').label('Provider'),
                nga.field('rider.display_name')
                        .label('Rider')
                        .cssClasses(function(entry) {
                            if (!entry)
                                return;
                            if (!entry.values.rider.id) {
                                return 'bg-danger';
                            }
                            else {
                                return '';
                            }
                        }),
//                nga.field('category_id', 'reference')
//                        .targetEntity(category)
//                        .targetField(nga.field('name'))
//                        .label('Category'),
                nga.field('user_id', 'text')
//                        .targetEntity(user)
//                        .targetField(nga.field('username'))
//                        .label('User')
                        .cssClasses(function(entry) {
                            if (!entry)
                                return;
                            if (!entry.values.user_id) {
                                return 'bg-danger';
                            }
                            else {
                                return '';
                            }
                        }),
                nga.field('status_action', 'template')
                        .label('Status action')
                        .template('<status-buttons model="video-tags" entry="entry" status="[\'validated\',\'rejected\',\'pending\']"></status-buttons>')
            ])
            .listActions([
                'show',
//                'edit',
                'delete',
                '<custom-link text="edit" entry="entry" url="video-tags/custom-edit"></custom-link>',
                '<preview-tag entry="entry"></preview-tag>'
            ])
            .filters([
//                nga.field('q')
//                        .label('Full-Text')
//                        .pinned(true),
                nga.field('status', 'choices')
                        .choices(EntityStatus.VideoTag)
                        .label('status')
                        .pinned(true),
                nga.field('min_duration', 'number')
                        .label('Min duration')
                        .pinned(true),
                nga.field('max_duration', 'number')
                        .label('Max duration')
                        .pinned(true),
                nga.field('user_id', 'reference')
                        .targetEntity(user)
                        .targetField(nga.field('username'))
                        .label('User')
                        .remoteComplete(true, {
                            refreshDelay: 500,
                            searchQuery: function(search) {
                                return {q: search};
                            }
                        })
                        .remoteComplete(true)
                        .pinned(false),
                nga.field('rider_id', 'reference')
                        .targetEntity(rider)
                        .targetField(nga.field('_fullname')
                                .map(function(val, data) {
                                    if (!data)
                                        return '';
                                    return data.firstname + ' ' + data.lastname + ' ' + data.nationality;
                                }))
                        .label('Rider')
                        .remoteComplete(true, {
                            refreshDelay: 500,
                            searchQuery: function(search) {
                                return {q: search};
                            }
                        })
                        .pinned(false),
                nga.field('sport_id', 'reference')
                        .targetEntity(sport)
                        .targetField(nga.field('name'))
                        .label('Sport')
                        .pinned(false),
                nga.field('category_id', 'reference')
                        .targetEntity(category)
                        .targetField(nga.field('name'))
                        .label('Category')
                        .pinned(false)
            ])
            .batchActions(['delete']);

    videoTags.showView()
            .fields([
                nga.field('id'),
                nga.field('status')
                        .cssClasses(cssStatus),
                nga.field('begin'),
                nga.field('end'),
                nga.field('slug'),
                nga.field('created', 'datetime'),
                nga.field('modified', 'datetime'),
                nga.field('video_id', 'reference')
                        .targetEntity(video)
                        .targetField(nga.field('video_url'))
                        .label('Video'),
                nga.field('rider_id', 'reference')
                        .targetEntity(rider)
//                        .targetReferenceField('rider_id') 
//                        .targetFields([nga.field('firstname'), nga.field('lastname')])
                        .targetField(nga.field('lastname'))
                        .label('Rider'),
                nga.field('category_id', 'reference')
                        .targetEntity(category)
                        .targetField(nga.field('name'))
                        .label('Category'),
                nga.field('user_id', 'reference')
                        .targetEntity(user)
                        .targetField(nga.field('username'))
                        .label('User')
            ]);

    videoTags.editionView()

            .fields([
                nga.field('id')
            ]);
    // add the user entity to the admin application
    admin.addEntity(videoTags);




    // -------------------------------------------------------------
    // set the fields of the user entity list view


    category.listView().fields([
        nga.field('id'),
        nga.field('name').isDetailLink(true),
        nga.field('slug'),
        nga.field('sport_id', 'reference')
                .targetEntity(sport)
                .targetField(nga.field('name'))
                .label('Sport'),
        nga.field('status')
                .cssClasses(cssStatus),
        nga.field('position')
    ])
            .listActions(['show', 'edit', 'delete'])
            .batchActions(['delete']);
    // add the user entity to the admin application
    category.creationView()
            .fields([
                nga.field('sport_id', 'reference')
                        .label('Sport')
                        .targetEntity(sport)
                        .targetField(nga.field('name')),
                nga.field('name')
                        .validation({required: true, minlength: 2, maxlength: 25}),
                nga.field('slug')
                        .validation({required: true, minlength: 2, maxlength: 25}),
                nga.field('status', 'choice')
                        .validation({required: true})
                        .choices(EntityStatus.Category),
                nga.field('position')
                        .validation({required: false})
            ]);
    category.editionView()
            .fields(category.creationView().fields());

    admin.addEntity(category);
    // -------------------------------------------------------------

//    admin.header(require(__AdminPathConfig__.template + '/dashboard/header.html'));

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}