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
class RidersController extends AppController {

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['view', 'facebook_search', 'local_search', 'profile', 'sports', 'tags']);
    }

    /**
     * API
     * 
     * Count all sports and sport category for the user
     */
    public function sports($riderId = null){
        if (empty($riderId)){
            throw new \Cake\Network\Exception\NotFoundException();
        }
        $query = $this->Riders->findRiderSports($riderId);
        ResultMessage::setWrapper(false);
        ResultMessage::overwriteData($query->all());
    }
    /**
     * API
     * 
     * Count all sports and sport category for the user
     */
    public function tags($riderId = null){
        if (empty($riderId)){
            throw new \Cake\Network\Exception\NotFoundException();
        }
        $query = $this->Riders->findRiderTags($riderId);
        ResultMessage::setWrapper(false);
        ResultMessage::overwriteData($query->all());
    }
    
    /**
     * API
     * 
     * Get user rider profile is $profileId is null. Otherwise rider profile for $profileId
     */
    public function profile($slug = null) {
        ResultMessage::setWrapper(false);
        if (!empty($slug)) {
            $query = $this->Riders->findPublic()
                    ->limit(1)
                    ->where(['Riders.slug' => $slug]);
            $data = $query->first();
            
        } 
        if (empty($data)){
            throw new \Cake\Network\Exception\NotFoundException();
        }
        $data['sports'] = $this->Riders->findRiderSports($data['id']);
        $data['popular_tags'] = $this->Riders->findRiderTags($data['id']);
        ResultMessage::overwriteData($data);
    }

    /**
     * 
     * Create a new rider (not associated with the current user)
     * 
     * @return type
     */
    public function add() {
        if ($this->request->is('post')) {
            $rider = $this->Riders->newEntity($this->request->data);
            $rider->user_id = null;
            $rider->level = 3;
            if ($this->Riders->save($rider)) {
                ResultMessage::setData('rider_id', $rider->id);
                ResultMessage::setData('rider_display_name', $rider->display_name);
                ResultMessage::setData('level_string', $rider->level_string);
                ResultMessage::setMessage("Rider profile has been saved", true);
                return;
            }
            ResultMessage::addValidationErrorsModel($rider);
        }
        ResultMessage::setMessage("Cannot create rider profile", false);
    }

    /**
     * API
     * 
     * Save rider profile
     * todo: delete old one
     * @return type
     */
    public function save() {
        ResultMessage::setWrapper(true);
//        debug($this->request);
        if ($this->request->is('post')) {
            $userId = $this->Auth->user('id');
            $rider = $this->Riders->find()->where(['Riders.user_id' => $userId])->first();
            if (!empty($rider)) {
                $rider = $this->Riders->patchEntity($rider, $this->request->data);
            } else {
                $rider = $this->Riders->newEntity($this->request->data);
                $rider->user_id = $this->Auth->user('id');
            }
            if ($this->Riders->save($rider)) {
                ResultMessage::setData('rider_id', $rider->id);
                ResultMessage::setData('picture_original', $rider->picture_original);
                ResultMessage::setData('picture_portrait', $rider->picture_portrait);
                ResultMessage::setData('level_string', $rider->level_string);
                ResultMessage::setMessage("Rider profile has been saved", true);
                return;
            }
            ResultMessage::addValidationErrorsModel($rider);
        }
        ResultMessage::setMessage("Cannot save rider profile", false);
    }

    /**
     * @queryType GET
     * 
     * Return a list of the most famous tag begining by the search term $term
     * @param string $term
     */
    public function local_search() {
        ResultMessage::setWrapper(false);
        if ($this->request->is('get')) {
            $data = $this->request->query;
            $this->Riders->initFilters();
            if (!isset($data['q']) && (!isset($data['firstname']) || !isset($data['lastname']))) {
                throw new \Cake\Network\Exception\NotFoundException();
            }
            $query = $this->Riders->find('search', $this->Riders->filterParams($this->request->query))
                    ->select([
                        'Riders.firstname',
                        'Riders.lastname',
                        'Riders.nationality',
                        'Riders.slug',
                        'Riders.count_tags',
//                        'Riders.level',
                        'Riders.id',
                    ])
                    ->order(['Riders.count_tags DESC','Riders.level DESC'])
                    ->limit(20);
            $this->Riders->findPublic($query);
            
            if (isset($data['q'])) {
                $searchHelper = new \App\Lib\SearchHelper($data, $query);
                $searchHelper->required('q', 
                        'CONCAT(firstname, \' \', lastname)', [
                            'type' => 'keywords'
                        ]);
            } else {
                $query->where([
                    'Riders.firstname LIKE "%' . DataUtil::getLowerString($data, 'firstname') . '%"',
                    'Riders.lastname LIKE "%' . DataUtil::getLowerString($data, 'lastname') . '%"',
                ]);
            } 
            ResultMessage::overwriteData($query->all());
        }
    }

    
    
    /**
     * Search rider thanks to Facebook API
     * @return type
     */
//    public function facebook_search() {
//        ResultMessage::setWrapper(false);
//        // If not log in with facebook
//        if (!$this->Auth->user('access_token')) {
//            throw new \Cake\Network\Exception\UnauthorizedException("You must be logged in facebook");
//        }
//        if ($this->request->is('get') && !empty($this->request->query['q']) && strlen($this->request->query['q']) > 2) {
//            $q = $this->request->query['q'];
//            $facebookRequest = new \App\Lib\FacebookRequest([
//                'key' => \Cake\Core\Configure::read('Facebook.key'),
//                'id' => \Cake\Core\Configure::read('Facebook.id'),
//                'token' => $this->Auth->user('access_token')->getValue()
//            ]);
//
//            $data = $facebookRequest->searchPeople($q);
//            if ($data) {
//                ResultMessage::overwriteData($data);
//                return;
//            }
//        }
//
//        ResultMessage::overwriteData([
//            'data' => [],
//            'next' => null
//        ]);
//        return;
//    }

}
