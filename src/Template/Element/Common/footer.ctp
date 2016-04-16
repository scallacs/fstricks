<footer class="nopadding" >
    <div class="footer clearfix">
        <div >
            <div class="col-sm-4">
                <ul class="list-unstyled">
                    <li ng-repeat="sport in sports">
                        <a  ui-sref="videoplayer.sport({sportSlug: sport.slug})" lass="text-capitalize" ng-click="setCurrentSport(sport)">
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
                <ul class="list-inline">
                    <li><a ui-sref="gtu">Terms of Use</a></li>
                    <li><a ui-sref="privacy_policy">Privacy Policy</a></li>
                    <li><a ui-sref="contact">Contact</a></li>
                </ul>

                <div>
                    Sports icons are made by 
                    <a href="http://www.freepik.com" title="Freepik">Freepik</a> from 
                    <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> 
                </div>
            </div>
        </div>
    </div>
    <div id="IsXSDevice" class="visible-xs"></div>
</footer>