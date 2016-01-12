<footer>
    <div class="footer clearfix">
        <div class="col-xs-8">
            <ul class="list-inline">
                <li ng-repeat="sport in sports">
                    <a ng-href="#/sports/{{sport.name}}"  class="text-capitalize" ng-click="setCurrentSport(sport)">
                        {{sport.name}}
                    </a>
                </li>
            </ul>
            <ul class="list-inline">
                <li><a href="#/faq">FAQ</a></li>
                <li><a href="#/contact">Contact</a></li>
            </ul>
        </div>
        <div class="col-xs-4">
            <p class="copyright text-center">
                © 2016 fstricks.com All Rights Reserved
            </p>
        </div>
    </div>
</footer>