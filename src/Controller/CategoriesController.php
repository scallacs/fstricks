<?php

namespace App\Controller;

use App\Controller\AppController;

/**
 * Categories Controller
 *
 * @property \App\Model\Table\CategoriesTable $Categories
 */
class CategoriesController extends AppController {

    /**
     * Index method
     *
     * @return void
     */
    public function index() {
        \App\Lib\ResultMessage::overwriteData($this->Categories->find('all'));
        \App\Lib\ResultMessage::setWrapper(false);
    }

}
