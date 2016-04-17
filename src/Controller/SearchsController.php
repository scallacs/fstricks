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
            if ($this->request->is('get') && !empty($this->request->query)) {
                $query = $this->Searchs->find('all')
                        ->order(['points DESC'])
                        ->limit(20);
                // TODO replace with other lib ? 
                $searchHelper = new \App\Lib\SearchHelper($this->request->query, $query);
                $searchHelper->required('q', 'Searchs.title', [
                            'type' => 'keywords'
                        ])
                        ->optional('sport_id', 'Searchs.sport_id', [
                            'type' => 'default',
                            'acceptNull' => true
                        ]);
                ResultMessage::overwriteData($query->all());
            }
        } catch (\App\Lib\MissingSearchParams $ex) {
            
        }
    }

}
