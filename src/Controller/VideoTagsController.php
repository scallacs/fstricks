<?php

namespace App\Controller;

use App\Lib\ResultMessage;
use App\Lib\DataUtil;
use App\Model\Entity\VideoTag;
use Cake\Core\Configure;

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
        $this->Auth->allow(['view', 'search', 'trending']);
    }

    /**
     * View method
     *
     * @param string|null $id Video Tag id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null) {
        if (empty($id)) {
            throw new \Cake\Network\Exception\NotFoundException();
        }
        $parts = explode('-', $id, 2);
        $id = $parts[0];

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
        if ($id === null || !$this->request->is('post')) {
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
        if ($this->request->is('post')) {
            $data = $this->request->data;

            $videoTag = $this->VideoTags->saveWithTag(null, $this->Auth->user('id'), $data, ['rider_id', 'begin', 'end', 'tag_id', 'tag', 'video_id']);
            $videoTag->user_id = $this->Auth->user('id');

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
                $data = $this->request->data;

                $videoTag = $this->VideoTags->get($id);
                if (!$videoTag->isEditabled($this->Auth->user('id'))) {
                    throw new \Cake\Network\Exception\NotFoundException();
                }
                $videoTag = $this->VideoTags->saveWithTag($videoTag, $this->Auth->user('id'), $data, ['rider_id', 'begin', 'end', 'tag_id', 'tag']);
//                $videoTag->tag = isset($this->request->data['tag']) ? $this->request->data['tag'] : null;
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
                    'VideoTags.status' => VideoTag::STATUS_PENDING,
                    'VideoTags.modified < ' => time() - \Cake\Core\Configure::read('VideoTagValidation.delay_before_validation')
                ])
                ->notMatching('VideoTagAccuracyRates', function ($q) {
                    return $q->where(['VideoTagAccuracyRates.user_id' => $this->Auth->user('id')]);
                })
                ->order(['VideoTags.modified DESC'])
                ->limit(1);
        if (count($skipped) > 0) {
            $query->where(['VideoTags.id NOT IN' => $skipped]);
        }
        if (DataUtil::isPositiveInt($this->request->query, 'sport_id')) {
            $query->where(['Categories.sport_id' => DataUtil::getPositiveInt($this->request->query, 'sport_id')]);
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
        if (!$this->request->is('post') || empty($this->request->data['VideoTag'])) {
            return;
        }
        $paginateOptions = [
            'limit' => 5,
            'maxLimit' => 5
        ];
        $this->Paginator->config($paginateOptions);
        $data = $this->VideoTags->newEntity($this->request->data['VideoTag']);
        $query = $this->VideoTags->findSimilarTags($data->video_id, $data->begin, $data->end);
        ResultMessage::overwriteData($this->paginate($query, $paginateOptions));
    }

    /**
     * GET dat
     */
    public function search() {
        $filterStatus = true;
        $this->Paginator->config(Configure::read('Pagination.VideoTags'));
        $this->VideoTags->initFilters();
        $query = $this->VideoTags->find('search', $this->VideoTags->filterParams($this->request->query));
        $query = $this->VideoTags->findAndJoin($query);
        $query->where(['Videos.status' => \App\Model\Entity\Video::STATUS_PUBLIC]);

        $order = empty($this->request->query['order']) ? 'best' : $this->request->query['order'];
        switch ($order) {
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

//        if (!empty($this->request->query['category_name']) && isset($sportName)) {
//            $categoryName = \App\Lib\DataUtil::lowername($this->request->query['category_name']);
//            $sports = \Cake\ORM\TableRegistry::get('Sports');
//            $category = $sports->findFromCategoryCached($sportName, $categoryName);
//            if (!empty($category)) {
//                $query->where(['Tags.category_id' => $category['id']]);
//            }
//        }

        if (DataUtil::isPositiveInt($this->request->query, 'video_id')) {
            $videoId = DataUtil::getPositiveInt($this->request->query, 'video_id');
            $videosTable = \Cake\ORM\TableRegistry::get('Videos');
            ResultMessage::setPaginateExtra('video', $videosTable->getPublic($videoId));
        }
        if (isset($this->request->query['only_owner'])) {
            if (!$this->Auth->user('id')) {
                throw new \Cake\Network\Exception\UnauthorizedException();
            }
            $query->where(['VideoTags.user_id' => $this->Auth->user('id')]);
        }
        
        // Must be the owner to filter by status
        if ($this->Auth->user('id') && !empty($this->request->query['status'])){
            $status = explode(',', $this->request->query['status']);
            $allowedStatus = [VideoTag::STATUS_PENDING, VideoTag::STATUS_VALIDATED];
            $status = array_intersect($allowedStatus, $status);
            
            $condition = !empty($status) ? ['VideoTags.status IN' => $status] : [];
            if (in_array(VideoTag::STATUS_REJECTED, $status)){
                $condition = [
                    'OR' => [
                        $condition,
                        ['VideoTags.status IN' => [VideoTag::STATUS_REJECTED, VideoTag::STATUS_DUPLICATE], 
                            'VideoTags.user_id' => $this->Auth->user('id')],
                    ]
                ];
            }
            $query->where($condition);
        }
        else{
            $query->where(['VideoTags.status ' => VideoTag::STATUS_VALIDATED]);
        }
        
//        if (DataUtil::isPositiveInt($this->request->query, 'video_tag_id')) {
//            $filterStatus = false;
//        }
        if (!empty($this->request->query['status'])) {
                $query->where([
                    'OR' => [
                        ['VideoTags.status IN' => [VideoTag::STATUS_PENDING, VideoTag::STATUS_VALIDATED]],
                        ['VideoTags.status' => VideoTag::STATUS_REJECTED, 'VideoTags.user_id' => $this->Auth->user('id')],
                    ]
                ]);
        }
        ResultMessage::paginate($query, $this);
    }

    public function trending() {
        ResultMessage::setWrapper(false);
        $query = $this->VideoTags->findTrending();
        ResultMessage::overwriteData($query->all());
    }

    /**
     * Return recently tagged video by user
     * UPDATE tags T SET count_ref = (SELECT count(*) FROM video_tags WHERE tag_id = T.id)
     */
    public function recentlyTagged() {
        ResultMessage::setWrapper(false);
        // TODO configuration 
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

            ResultMessage::setPaginateData(
                    $this->paginate($query, $paginateOptions), $this->request->params['paging']['VideoTags']);
        } catch (NotFoundException $e) {
            ResultMessage::overwriteData($data);
        }
    }

}
