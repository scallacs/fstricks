<footer class="nopadding" >
    <div class="footer clearfix">
        <div >
            <div class="col-sm-4">
                <ul class="list-unstyled">
                    <li ng-repeat="sport in sports">
                        <a ng-href="#/sports/{{sport.name}}"  class="text-capitalize" ng-click="setCurrentSport(sport)">
                            {{sport.name}}
                        </a>
                    </li>
                </ul>
            </div>
            <div class="col-sm-4">
                <!--
                <ul class="list-unstyled">
                    <li class="text-big">
                        <a ui-sref="addviode">
                            <span class="glyphicon glyphicon-plus-sign"></span> Add a trick
                        </a>
                    </li>
                </ul>-->
            </div>
            <div class="col-sm-4">
                <p class="copyright">
                    © 2016 fstricks.com All Rights Reserved
                </p>
                <ul class="list-inline">
                    <li><a href="#/faq">FAQ</a></li>
                    <li><a href="#/contact">Contact</a></li>
                </ul>

                <div>
                    Sports icons are made by 
                    <a href="http://www.freepik.com" title="Freepik">Freepik</a> from 
                    <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> 
                </div>
            </div>
        </div>
    </div>
</footer>