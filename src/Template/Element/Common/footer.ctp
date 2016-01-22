<footer class="nopadding">
    <div class="footer clearfix">
        <div >
            <div class="">
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
            <div class="">
                <p class="copyright">
                    © 2016 fstricks.com All Rights Reserved
                </p>
            </div>
        </div>
    </div>
</footer>