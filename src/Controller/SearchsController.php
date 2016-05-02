<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;
use App\Lib\DataUtil;

/**
 * Riders Controller
 *
 * @property \App\Model\Table\RidersTable $Riders
 */
class SearchsController extends AppController {

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['search']);
    }

    /**
     * @queryType GET
     * 
     * Return a list of the most famous tag begining by the search term $term
     * @param string $term
     */
    public function search() {
        ResultMessage::setWrapper(false);
        try {
            if ($this->request->is('get') && !empty($this->request->query['q'])) {

                $this->Searchs->initFilters();
                $query = $this->Searchs
                        ->find('search', $this->Searchs->filterParams($this->request->query))
                        ->order(['points DESC'])
                        ->limit(10);
                ResultMessage::overwriteData($query->all());
            }
        } catch (\App\Lib\MissingSearchParams $ex) {
            
        }
    }

}
