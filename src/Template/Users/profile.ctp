<div >
    <h2>Profile</h2>

    <div class="clearfix">
        <div class="col-sm-8">
            <table class="table table-striped">
                <tbody>
                    <tr>
                        <td>Username</td>
                        <td>{{data.user.username}}</td>
                    </tr>
                    <tr>
                        <td>Points</td>
                        <td>{{data.user.count_video_tags}}</td>
                        <td>The more you create valid video tags, the more you earn points!</td>
                    </tr>
                    <!--
                    <tr>
                        <td>Tags</td>
                        <td>{{data.user.tag_string}}</td>
                    </tr>
                    -->
                </tbody>
            </table>
        </div>

    <h3 class="text-center">Rider profile</h3>
    <form class="form-inline">
        <div class="form-group">
            <div class="input-group">
                <input type="text" 
                       class="form-control" 
                       placeholder="Firstname"
                       ng-model="newTag"/>
            </div>
            <div class="input-group">
                <input type="text" 
                       class="form-control" 
                       placeholder="Lastname"
                       ng-model="newTag"/>
            </div>
            <div class="input-group-btn">
                <button type="submit" class="btn btn-primary" ng-click="addTag(newTag)">
                    <span class="glyphicon glyphicon-plus-sign"></span>
                </button>
            </div>
        </div>
    </form>

        <div class="col-sm-4">
            <form class="form-inline">
                <ul class="list-unstyled nav-pills nav-stacked">
                    <li ng-repeat="tag in tags" class="">
                        <a href="" class="user-profile-tag">#{{tag.name}}</a> 
                        <button type="button" class="btn btn-default btn-sm pull-right" ng-click="removeTag($index)">
                            <span class="glyphicon glyphicon-trash"></span>
                        </button>
                    </li>
                    <li class="form-group">
                        <div class="input-group">
                            <input type="text" 
                                   class="form-control" 
                                   placeholder="Add a tag"
                                   ng-model="newTag"/>
                            <div class="input-group-btn ">
                                <button type="submit" class="btn btn-primary" ng-click="addTag(newTag)">
                                    <span class="glyphicon glyphicon-plus-sign"></span>
                                </button>
                            </div>
                        </div>
                    </li>
                    <li ng-if="isSaved()" class="text-center text-muted">
                        {{message}}
                    </li>
                    <li ng-if="!isSaved()" class="text-center text-muted">
                        {{message}}
                    </li>
                </ul>
            </form>
        </div>
    </div>


</div>