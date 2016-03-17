<!DOCTYPE html>
<html>
    <head>
        <title><?= \Cake\Core\Configure::read('Browser.title_prefix') ;?> - Site Maintenance</title>
        <style>
            body { text-align: center; padding: 150px; background: #222;}
            h1 { font-size: 50px; }
            body { font: 20px Helvetica, sans-serif; color: #333; }
            .maintenance { display: block; text-align: left; width: 650px; margin: 0 auto; text-align: center; background: #eee; padding: 3em; border-radius: 5px;}
            a { color: #dc8100; text-decoration: none; }
            a:hover { color: #333; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="maintenance">
            <h1>
                <?= \Cake\Core\Configure::read('Browser.title_prefix') ;?>
            </h1>
            <h2>
                Sorry, we're down for maintenance.
            </h2>
            <p>
                We'll be back shortly.
            </p>
        </div>
    </body>
</html>