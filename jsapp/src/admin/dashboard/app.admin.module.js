
angular.module('app.admin.dashboard', ['ng-admin'])
        .config(Config)
        .config(RestangularProviderConfig);

RestangularProviderConfig.$inject = ['RestangularProvider', '$windowProvider'];
function RestangularProviderConfig(RestangularProvider, $windowProvider) {
    // RESPONSE
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response) {
        if (response.status === 401) {
            $windowProvider.$get = ['$window', function($window) {
                    $window.location.href = '/make-me-god-please';
                }];
        }
        if (operation === "getList") {
//            var contentRange = response.headers('Content-Range');
//            response.totalCount = contentRange.split('/')[1];
//            console.log(response);
            //var body = response.body();
            response.totalCount = response.data.total;
            data = response.data.items;
        }

        return data;
    });
    // REQUEST
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
        if (operation === 'getList') {
            params.page = params._page;
            params.limit = params._perPage;

            params.sort = params._sortField || null;
            params.direction = params._sortDir || null;

            delete params._page;
            delete params._perPage;
            delete params._sortField;
            delete params._sortDir;

            if (params._filters) {
                for (var filter in params._filters) {
                    params[filter] = params._filters[filter];
                }
                delete params._filters;
            }
        }
        return {params: params};
    });
}
;

Config.$inject = ['NgAdminConfigurationProvider'];
function Config(nga) {
    // create an admin application
    var admin = nga.application('Freestyle Tricks Admin')
            .baseApiUrl(ADMIN_API_BASE_URL); // main API endpoint;
    // -------------------------------------------------------------
    var user = nga.entity('users');
    var tag = nga.entity('tags');

    var quotaType = nga.entity('quota-types');
    quotaType.baseApiUrl(ADMIN_API_BASE_URL + 'activity-quota/');
    var userQuota = nga.entity('user-quotas');
    userQuota.baseApiUrl(ADMIN_API_BASE_URL + 'activity-quota/');


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
            .listActions(['edit', 'delete'])
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
    // set the fields of the user entity list view
    tag.listView().fields([
        nga.field('name'),
        nga.field('count_ref'),
        nga.field('created')
    ])
            .filters([
                nga.field('q')
                        .label('Full-Text')
                        .pinned(true),
                nga.field('status', 'choices')
                        .choices([
                            {label: 'validated', value: 'validated'},
                            {label: 'unknown', value: 'unknown'},
                            {label: 'pending', value: 'pending'}
                        ])
                        .label('status')
                        .pinned(false)
            ])
            .listActions(['edit', 'delete'])
            .batchActions(['delete']);

    tag.creationView()
            .fields([
                nga.field('name')
                        .validation({required: true})
            ]);

    tag.editionView()
            .fields(tag.creationView().fields());
    admin.addEntity(tag);
    // -------------------------------------------------------------

    // set the fields of the user entity list view
    user.listView().fields([
        nga.field('username'),
        nga.field('email'),
        nga.field('status'),
        nga.field('provider_id'),
        nga.field('provider_uid'),
        nga.field('created', 'date'),
        nga.field('last_login', 'date')
    ])
            .filters([
                nga.field('q')
                        .label('Full-Text')
                        .pinned(true),
                nga.field('status', 'choices')
                        .choices([
                            {label: 'validated', value: 'validated'},
                            {label: 'unknown', value: 'unknown'},
                            {label: 'pending', value: 'pending'}
                        ])
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
                            {label: 'public', value: 'public'},
                            {label: 'private', value: 'private'}
                        ])
                        .label('Status')
                        .pinned(true),
                nga.field('provider_id', 'choice')
                        .choices([
                            {label: 'vimeo', value: 'vimeo'},
                            {label: 'youtube', value: 'youtube'}
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
                            {label: 'accepted', value: 'accepted'},
                            {label: 'rejected', value: 'rejected'},
                            {label: 'pending', value: 'pending'}
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
                            {label: 'validated', value: 'validated'},
                            {label: 'unknown', value: 'unknown'},
                            {label: 'pending', value: 'pending'}
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
                            {label: 'accepted', value: 'accepted'},
                            {label: 'rejected', value: 'rejected'},
                            {label: 'pending', value: 'pending'}
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




    // -------------------------------------------------------------
    var category = nga.entity('categories');
    // set the fields of the user entity list view
    category.listView().fields([
//        nga.field('id'),
        nga.field('name').isDetailLink(true),
//        nga.field('image'),
        nga.field('position')
    ])
            .listActions(['edit', 'delete'])
            .batchActions(['delete']);
    // add the user entity to the admin application
    category.creationView()
            .fields([
                nga.field('name')
                        .validation({required: true, minlength: 2, maxlength: 25}),
//                nga.field('image')
//                        .validation({required: false}),
                nga.field('position')
                        .validation({required: false})
            ]);
    category.editionView()
            .fields(category.creationView().fields());

    admin.addEntity(category);
    // -------------------------------------------------------------

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}