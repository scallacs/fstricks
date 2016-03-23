<footer class="nopadding" >
    <div class="footer clearfix">
        <div >
            <div class="col-sm-4">
                <ul class="list-unstyled">
                    <li ng-repeat="sport in sports">
                        <a  ui-sref="videoplayer.sport({sportName: sport.name})" lass="text-capitalize" ng-click="setCurrentSport(sport)">
                            {{sport.name}}
                        </a>
                    </li>
                </ul>
            </div>
            <div class="col-sm-4">
            </div>
            <div class="col-sm-4">
                <p class="copyright">
                    © 2016 fstricks.com All Rights Reserved
                </p>
            </div>
        </div>
    </div>
    <div id="IsXSDevice" class="visible-xs"></div>
</footer>