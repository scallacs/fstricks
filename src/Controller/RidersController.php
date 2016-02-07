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
        $this->Auth->allow(['view', 'facebook_search', 'local_search', 'profile']);
    }

    /**
     * API
     * 
     * Get user rider profile is $profileId is null. Otherwise rider profile for $profileId
     */
    public function profile($profileId = null) {
        ResultMessage::setWrapper(false);
        $query = $this->Riders->find();
        if ($profileId === null && $this->Auth->user('id')) {
            $query->where(['Riders.user_id' => $this->Auth->user('id')]);
        } else if (!empty($profileId)) {
            $query->where(['Riders.id' => $profileId]);
        } else {
            throw new \Cake\Network\Exception\UnauthorizedException();
        }
        $data = $query->first();
        if (empty($data)) {
            throw new \Cake\Network\Exception\NotFoundException();
        }
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

            if ($this->Riders->save($rider)) {
                ResultMessage::setData('rider_id', $rider->id);
                ResultMessage::setData('rider_display_name', $rider->display_name);
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
                ResultMessage::setMessage("Rider profile has been saved", true);
                return;
            }
            ResultMessage::addValidationErrorsModel($rider);
        }
        ResultMessage::setMessage("Cannot save rider profile", false);
    }

    /**
     * Search rider thanks to Facebook API
     * @return type
     */
    public function facebook_search() {
        ResultMessage::setWrapper(false);
        // If not log in with facebook
        if (!$this->Auth->user('access_token')) {
            throw new \Cake\Network\Exception\UnauthorizedException("You must be logged in facebook");
        }
        if ($this->request->is('get') && !empty($this->request->query['q']) && strlen($this->request->query['q']) > 2) {
            $q = $this->request->query['q'];
            $facebookRequest = new \App\Lib\FacebookRequest([
                'key' => \Cake\Core\Configure::read('Facebook.key'),
                'id' => \Cake\Core\Configure::read('Facebook.id'),
                'token' => $this->Auth->user('access_token')->getValue()
            ]);

            $data = $facebookRequest->searchPeople($q);
            if ($data) {
                ResultMessage::overwriteData($data);
                return;
            }
        }

        ResultMessage::overwriteData([
            'data' => [],
            'next' => null
        ]);
        return;
    }

    /**
     * @queryType GET
     * 
     * Return a list of the most famous tag begining by the search term $term
     * @param string $term
     */
    public function local_search() {
        ResultMessage::setWrapper(false);
        ResultMessage::overwriteData([
            'data' => [],
            'next' => null
        ]);
        if ($this->request->is('get') && !empty($this->request->query)) {
            $data = $this->request->query;
            $query = $this->Riders->find('all')
                    ->select([
                        'firstname' => 'Riders.firstname',
                        'lastname' => 'Riders.lastname',
                        'nationality' => 'Riders.nationality',
                        'slug' => 'Riders.slug',
                        'id' => 'Riders.id',
                    ])
                    ->order(['Riders.level DESC'])
                    ->limit(20);
            if (isset($data['q'])) {
                $term = DataUtil::getLowerString($data, 'q');
                $terms = explode(' ', $term);
                $conditions = [];
                foreach ($terms as $term){
                    $conditions[] = 'CONCAT(Riders.firstname, \' \', Riders.lastname) LIKE "%' . trim($term) . '%"';
                }
                $query->where([
                    $conditions,
                ]);
            } else if (isset($data['firstname']) ||
                    isset($data['lastname'])) {

                $query->where([
                    'Riders.firstname LIKE "%' . DataUtil::getLowerString($data, 'firstname') . '%"',
                    'Riders.lastname LIKE "%' . DataUtil::getLowerString($data, 'lastname') . '%"',
                ]);
            } else {
                return;
            }
//                    ->order(['Riders.count_video_tags DESC']);
            ResultMessage::overwriteData([
                'data' => $query->all(),
                'next' => null
            ]);
        } 
    }

}
