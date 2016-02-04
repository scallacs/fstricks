<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;

/**
 * VideoTags Controller
 *
 * @property \App\Model\Table\VideoTagsTable $VideoTags
 */
class VideoTagsController extends AppController {

    public function initialize() {
        parent::initialize();
        $this->loadComponent('Paginator');
    }

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['view', 'search']);
    }

    /**
     * View method
     *
     * @param string|null $id Video Tag id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null) {
        $videoTag = $this->VideoTags->findAndJoin()
                ->where(['VideoTags.id' => $id])
                ->limit(1)
                ->first();
        ResultMessage::overwriteData($videoTag);
        ResultMessage::setWrapper(false);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add() {
        ResultMessage::setWrapper(true);
        $videoTag = $this->VideoTags->newEntity();
        if ($this->request->is('post')) {
            $data = $this->request->data;

            // Creating a new tag if needed !
            $createTag = isset($data['tag']);
            if ($createTag) {
                // Create tag 
                $tagTable = \Cake\ORM\TableRegistry::get('Tags');
                $tagEntity = $tagTable->newEntity($data['tag']);
                $tagEntity->user_id = $this->Auth->user('id');
                if (!$tagTable->save($tagEntity)) {
                    ResultMessage::addValidationErrorsModel($tagEntity);
                    ResultMessage::setMessage(__('Cannot create this trick'), false);
                    return;
                } else {
                    ResultMessage::addStepSuccess("Adding a the new trick");
                }
                unset($data['tag']);
            }

            $videoTag = $this->VideoTags->patchEntity($videoTag, $data);
            $videoTag->user_id = $this->Auth->user('id');
            if ($createTag) {
                $videoTag->tag_id = $tagEntity->id;
            }

            if ($this->VideoTags->save($videoTag)) {
                ResultMessage::setMessage(__('Your trick has been saved.'), true);
                ResultMessage::setData('video_tag_id', $videoTag->id);
                ResultMessage::setData('tag_id', $videoTag->tag_id);
            } else {
                ResultMessage::setMessage(__('Your trick could not be saved, please check your inputs.'), false);
                ResultMessage::addValidationErrorsModel($videoTag);
            }
        }
    }

    /**
     * GET data
     *  - sport_id
     *  - category_id
     *  - tag_id
     *  - video_id
     *  - page: page number
     */
    public function search() {
        $paginateOptions = [
            'limit' => 20,
            'maxLimit' => 20
        ];
        $this->Paginator->config($paginateOptions);
        ResultMessage::setWrapper(false);

        try {
//        $limit = !empty($this->request->query['quantity']) && (int) $this->request->query['quantity'] < 20 ? $this->request->query['quantity'] : 10;
//        $offset = ((!empty($this->request->query['page']) ? (int) $this->request->query['page'] : 1) - 1) * $limit;

            $query = $this->VideoTags->findAndJoin();
            $query->where(['Videos.status' => \App\Model\Entity\Video::STATUS_PUBLIC]);

            if (!empty($this->request->query['order'])) {
                switch ($this->request->query['order']) {
                    case 'begin_time':
                        $query->order([
                            'VideoTags.begin ASC',
                        ]);
                        break;
                    case 'created':
                        $query->order([
                            'VideoTags.created DESC',
                            'VideoTags.count_points DESC',
                        ]);
                        break;
                    case 'best':
                    default:
                        $query->order([
                            'VideoTags.count_points DESC',
                            'VideoTags.created DESC'
                        ]);
                }
            }

            if (!empty($this->request->query['sport_id']) && is_numeric($this->request->query['sport_id'])) {
                $query->where(['Tags.sport_id' => $this->request->query['sport_id']]);
            } else if (!empty($this->request->query['sport_name'])) {
                // Get id from name
                $sports = \Cake\ORM\TableRegistry::get('Sports');
                $sportName = strtolower($this->request->query['sport_name']);
                $sport = $sports->findFromNameCached($sportName);
                if (!empty($sport)) {
                    $query->where(['Tags.sport_id' => $sport['id']]);
                }
            }
            if (!empty($this->request->query['category_id']) && is_numeric($this->request->query['category_id'])) {
                $query->where(['Tags.category_id' => $this->request->query['category_id']]);
            } else if (!empty($this->request->query['category_name']) && isset($sportName)) {
                $categoryName = strtolower($this->request->query['category_name']);
                $sports = \Cake\ORM\TableRegistry::get('Sports');
                $category = $sports->findFromCategoryCached($sportName, $categoryName);
                if (!empty($category)) {
                    $query->where(['Tags.category_id' => $category['id']]);
                }
            }

            if (!empty($this->request->query['tag_id']) && is_numeric($this->request->query['tag_id'])) {
                $query->where(['VideoTags.tag_id' => $this->request->query['tag_id']]);
            }
            if (!empty($this->request->query['trick_name'])) {
                $query->where(['Tags.slug' => $this->request->query['trick_name']]);
            }
            if (!empty($this->request->query['video_id']) && is_numeric($this->request->query['video_id'])) {
                $query->where(['VideoTags.video_id' => (int) $this->request->query['video_id']]);
            }
            if (!empty($this->request->query['rider_id']) && is_numeric($this->request->query['rider_id'])) {
                $query->where(['VideoTags.rider_id' => (int) $this->request->query['rider_id']]);
            }
//        if (!empty($this->request->query['with_total'])){
//            $data = [
//                
//            ]
//        }
            ResultMessage::overwriteData($this->paginate($query, $paginateOptions));
        } catch (NotFoundException $e) {
            ResultMessage::overwriteData([]);
        }
    }

    /**
     * Return recently tagged video by user
     * UPDATE tags T SET count_ref = (SELECT count(*) FROM video_tags WHERE tag_id = T.id)
     */
    public function recentlyTagged() {
        ResultMessage::setWrapper(false);
        $data = [
            'data' => null,
            'total' => null
        ];
        $paginateOptions = [
            'limit' => 5,
            'maxLimit' => 5
        ];
        $this->Paginator->config($paginateOptions);
        try {
            $query = $this->VideoTags->find('all')
                    ->select([
                        'provider_id' => 'Videos.provider_id',
                        'video_url' => 'Videos.video_url',
                        'id' => 'Videos.id'
                    ])
                    ->where(['VideoTags.user_id' => $this->Auth->user('id')])
                    ->order(['VideoTags.created DESC'])
                    ->contain(['Videos'])
                    ->distinct(['Videos.id']);

            $data['data'] = $this->paginate($query);
            if (!empty($this->request->query['total_number'])) {
                if (count($data['data']) < $paginateOptions['limit']) {
                    $data['total'] = count($data['data']);
                } else {
                    $data['total'] = $query->count();
                }
            }

            ResultMessage::overwriteData($data);
        } catch (NotFoundException $e) {
            ResultMessage::overwriteData($data);
        }
    }

    
}
