<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;
use App\Lib\DataUtil;
use App\Model\Entity\VideoTag;

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
                ->where(['VideoTags.id' => $id, 'VideoTags.status !=' => VideoTag::STATUS_BLOCKED])
                ->limit(1)
                ->first();
        ResultMessage::overwriteData($videoTag);
        ResultMessage::setWrapper(false);
    }

    /**
     * A user can only delete a video tag that he created
     * @param type $id
     */
    public function delete($id = null) {
        if ($id === null) {
            ResultMessage::setSuccess(false);
            return;
        }
        $success = $this->VideoTags->deleteAll([
            'id' => $id,
            'user_id' => $this->Auth->user('id'),
            'status !=' => VideoTag::STATUS_VALIDATED
        ]);
        if ($success) {
            ResultMessage::setMessage('This trick has beed successfully removed', $success);
        } else {
            ResultMessage::setMessage('Sorry but you are not allowed to remove it', $success);
        }
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

            $tagId = null;
            // Creating a new tag if needed !
            if (isset($data['tag'])) {
                // Create tag 
                $tagTable = \Cake\ORM\TableRegistry::get('Tags');
                $tagEntity = $tagTable->newEntity($data['tag']);
                $tagEntity->user_id = $this->Auth->user('id');
                $tagEntity = $tagTable->createOrGet($tagEntity, $this->Auth->user('id'));
                if (!$tagEntity) {
                    ResultMessage::setMessage(__('Cannot create this trick'), false);
                    return;
                }
                $tagId = $tagEntity->id;
                unset($data['tag']);
            }

            $videoTag = $this->VideoTags->patchEntity($videoTag, $data);
            $videoTag->user_id = $this->Auth->user('id');
            if ($tagId !== null) {
                $videoTag->tag_id = $tagId;
            }
            
            if ($this->VideoTags->save($videoTag)) {
                ResultMessage::setMessage(__('Your trick has been saved.'), true);
                ResultMessage::setData('video_tag_id', $videoTag->id);
                ResultMessage::setData('tag_id', $videoTag->tag_id);
                ResultMessage::setData('status', $videoTag->status);
            } else {
                ResultMessage::setMessage(__('Your trick could not be saved, please check your inputs.'), false);
                ResultMessage::addValidationErrorsModel($videoTag);
            }
        }
    }

    public function edit($id = null) {
        try {
            if (!empty($id) && is_numeric($id) &&
                    $this->request->is('post') && !empty($this->request->data)) {

                $videoTag = $this->VideoTags->get($id);
                if (!$videoTag->isEditabled($this->Auth->user('id'))) {
                    throw new \Cake\Network\Exception\NotFoundException();
                }
                $videoTag = $this->VideoTags->patchEntity($videoTag, $this->request->data, [
                    'fieldList' => ['rider_id', 'begin', 'end', 'tag_id']
                ]);
//                debug($videoTag);
                $videoTag->status = VideoTag::STATUS_PENDING;
                if ($this->VideoTags->save($videoTag)) {
                    ResultMessage::setMessage(__('Your trick has been saved.'), true);
                } else {
                    ResultMessage::setMessage(__('Your trick could not be saved.'), false);
                    ResultMessage::addValidationErrorsModel($videoTag);
                }
            } else {
                throw new \Cake\Network\Exception\NotFoundException();
            }
        } catch (\Cake\Datasource\Exception\RecordNotFoundException $ex) {
            throw new \Cake\Network\Exception\NotFoundException();
        }
    }

    /**
     * Return the next trick to validate
     * TODO add order on last status changed
     */
    public function validation() {
        ResultMessage::setWrapper(false);
        $skipped = [];
        if (!empty($this->request->query['skipped'])) {
            $skipped = explode(',', $this->request->query['skipped']);
        }
        $query = $this->VideoTags->findAndJoin()
                ->where([
                    'VideoTags.status' => VideoTag::STATUS_PENDING
                ])
                ->notMatching('VideoTagAccuracyRates', function ($q) {
                    return $q->where(['VideoTagAccuracyRates.user_id' => $this->Auth->user('id')]);
                })
                ->order(['VideoTags.modified DESC'])
                ->limit(1);
        if (count($skipped) > 0) {
            $query->where(['VideoTags.id NOT IN' => $skipped]);
        }
        ResultMessage::overwriteData($query->all());
    }

    /**
     * GET data
     *  - sport_id
     *  - category_id
     *  - tag_id
     *  - video_id
     *  - rider_id
     * - trick_slug
     *  - tag_name: "LIKE"
     *  - page: page number
     */
    public function similar() {
        ResultMessage::setWrapper(false);
        if (empty($this->request->data['VideoTag'])) {
            return;
        }
        $paginateOptions = [
            'limit' => 20,
            'maxLimit' => 20
        ];
        $this->Paginator->config($paginateOptions);
        $data = $this->VideoTags->newEntity($this->request->data['VideoTag']);
        $query = $this->VideoTags->findSimilarTags($data->video_id, $data->begin, $data->end);
        ResultMessage::overwriteData($this->paginate($query, $paginateOptions));
    }

    /**
     * GET data
     *  - sport_id
     *  - category_id
     *  - tag_id
     *  - video_id
     *  - rider_id
     * - trick_slug
     *  - tag_name: "LIKE"
     *  - page: page number
     */
    public function search() {
        $filterStatus = true;
        $paginateOptions = [
            'limit' => 20,
            'maxLimit' => 20
        ];
        $this->Paginator->config($paginateOptions);
        ResultMessage::setWrapper(false);

        try {
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
                    case 'modified':
                        $query->order([
                            'VideoTags.modified DESC',
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

            if (DataUtil::isPositiveInt($this->request->query, 'sport_id')) {
                $query->where(['Tags.sport_id' => $this->request->query['sport_id']]);
            } else if (!empty($this->request->query['sport_name'])) {
                // Get id from name
                $sports = \Cake\ORM\TableRegistry::get('Sports');
                $sportName = \App\Lib\DataUtil::lowername($this->request->query['sport_name']);
                $sport = $sports->findFromNameCached($sportName);
                if (!empty($sport)) {
                    $query->where(['Tags.sport_id' => $sport['id']]);
                }
            }
            if (DataUtil::isPositiveInt($this->request->query, 'category_id')) {
                $query->where(['Tags.category_id' => $this->request->query['category_id']]);
            } else if (!empty($this->request->query['category_name']) && isset($sportName)) {
                $categoryName = \App\Lib\DataUtil::lowername($this->request->query['category_name']);
                $sports = \Cake\ORM\TableRegistry::get('Sports');
                $category = $sports->findFromCategoryCached($sportName, $categoryName);
                if (!empty($category)) {
                    $query->where(['Tags.category_id' => $category['id']]);
                }
            }

            if (DataUtil::isPositiveInt($this->request->query, 'tag_id')) {
                $query->where(['VideoTags.tag_id' => $this->request->query['tag_id']]);
            }
            if (!empty($this->request->query['video_tag_ids'])) {
                $ids = explode(',', $this->request->query['video_tag_ids']);
                $query->where(['VideoTags.id IN' => $ids]);
            }
            if (DataUtil::isPositiveInt($this->request->query, 'video_tag_id')) {
                $filterStatus = false;
                $query->where(['VideoTags.id' => $this->request->query['video_tag_id']]);
            }
            if (!empty($this->request->query['trick_slug'])) {
                $query->where(['Tags.slug' => $this->request->query['trick_slug']]);
            }
            if (DataUtil::isPositiveInt($this->request->query, 'video_id')) {
                $query->where(['VideoTags.video_id' => (int) $this->request->query['video_id']]);
            }
            if (DataUtil::isPositiveInt($this->request->query, 'rider_id')) {
                $query->where(['VideoTags.rider_id' => (int) $this->request->query['rider_id']]);
            }

            if (!empty($this->request->query['status']) && $this->Auth->user('id')) {
                // TODO limit size of string
                $status = explode(',', $this->request->query['status']);
                $query->where([
                    'VideoTags.status IN' => $status,
                    'VideoTags.user_id' => $this->Auth->user('id')
                ]);
            } else if (!empty($this->request->query['with_pending'])) {
                $query->where(['VideoTags.status IN' => [VideoTag::STATUS_PENDING, VideoTag::STATUS_VALIDATED]]);
            } else if ($filterStatus) {
                $query->where(['VideoTags.status ' => VideoTag::STATUS_VALIDATED]);
            }

            if (!empty($this->request->query['tag_name'])) {
                $str = $this->request->query['tag_name'];
                \App\Model\Table\TableUtil::multipleWordSearch($query, $str, 'Tags.name');
            }
//        if (!empty($this->request->query['with_total'])){
//            $data = [
//                
//            ]
//        }
//            debug($query->sql());
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
