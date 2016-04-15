<?php

namespace App\Model\Table;

use App\Model\Entity\VideoTag;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * VideoTags Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Videos
 * @property \Cake\ORM\Association\BelongsTo $Tags
 * @property \Cake\ORM\Association\BelongsTo $Users
 * @property \Cake\ORM\Association\HasMany $VideoTagPoints
 */
class VideoTagsTable extends Table {

    const MIN_TAG_DURATION = 2; // TODO common with others
    const MAX_TAG_DURATION = 40;
    const SIMILARITY_RATIO_THRESHOLD = 0.6;
    const SIMILARITY_PRECISION_SECONDS = 2;
    const CACHE_GROUP_TRENDING = 'videotagstrending';

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config) {
        parent::initialize($config);

        $this->table('video_tags');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('Videos', [
            'foreignKey' => 'video_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('Tags', [
            'foreignKey' => 'tag_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('Riders', [
            'foreignKey' => 'rider_id',
            'joinType' => 'LEFT'
        ]);
        $this->belongsTo('Users', [
            'foreignKey' => 'user_id'
        ]);
        $this->hasMany('VideoTagAccuracyRates', [
            'foreignKey' => 'video_tag_id'
        ]);
    }

    public function initFilters($mode = 'default') {

        $this->addBehavior('Search.Search');
        $this->searchManager()
                ->add('video_id', 'Search.Value', [
                    'field' => $this->aliasField('video_id')
                ])
                ->add('user_id', 'Search.Value', [
                    'field' => $this->aliasField('user_id')
                ])
                ->add('rider_id', 'Search.Value', [
                    'field' => $this->aliasField('rider_id')
                ])
                ->add('rider_slug', 'Search.Value', [
                    'field' => 'Riders.slug'
                ])
                ->add('sport_id', 'Search.Value', [
                    'field' => 'Tags.sport_id'
                ])
                ->add('category_id', 'Search.Value', [
                    'field' => 'Tags.category_id'
                ])
                ->add('tag_id', 'Search.Value', [
                    'field' => 'Tags.id'
                ])
                ->add('trick_slug', 'Search.Value', [
                    'field' => 'Tags.slug'
                ])
                ->add('tag_slug', 'Search.Value', [
                    'field' => 'Tags.slug'
                ])
                ->add('min_duration', 'Search.Compare', [
                    'field' => $this->aliasField('end') . ' - ' . $this->aliasField('begin'),
                    'operator' => '>='
                ])
                ->add('max_duration', 'Search.Compare', [
                    'field' => $this->aliasField('end') . ' - ' . $this->aliasField('begin'),
                    'operator' => '<='
                ])
                ->add('status', 'Search.Value', [
                    'field' => $this->aliasField('status')
        ]);
//                    ->add('q', 'Search.Like', [
//                        'before' => true,
//                        'after' => true,
//                        'field' => [$this->aliasField('name')]
//            ]);
    }

    public function findTrending($limit = 5) {
        return $this->findAndJoin()
                        ->order(['VideoTags.count_points DESC'])
                        ->where(['VideoTags.status ' => VideoTag::STATUS_VALIDATED])
                        ->limit($limit)
                        ->cache(self::CACHE_GROUP_TRENDING, 'oneHourCache');
    }

    /**
     * Find data for tags and do joins 
     * 
     * @param query | null $queryVideo 
     * @param query | null $queryTags
     * @return query
     */
    public function findAndJoin($query = null, $queryVideo = null, $queryTags = null, $queryRiders = null) {
        if ($queryVideo === null) {
            $queryVideo = function($q) {
                return $q;
            };
        }
        if ($queryTags === null) {
            $queryTags = function($q) {
                return $q
                                ->select([
                                    'Categories.name',
                                    'Categories.id',
                                    'Categories.slug',
                                    'Sports.name',
                                    'Sports.slug',
                                    'Sports.id'
                                ])
                                ->contain(['Sports', 'Categories']);
            };
        }
        if ($queryRiders === null) {
            $queryRiders = function($q) {
                return $q->select([
                            'Riders__name' => 'CONCAT(Riders.firstname, \' \', Riders.lastname)',
                            'Riders.picture',
                            'Riders.nationality',
                            'Riders.slug',
                            'Riders.id'
                ]);
            };
        }
        if ($query === null) {
            $query = $this->find('all');
        }
        return $query
                        ->select([
                            'Tags.slug',
                            'Tags.name',
                            'Tags.id',
                            
                            'VideoTags.id',
                            'VideoTags.count_points',
                            'VideoTags.begin',
                            'VideoTags.end',
                            'VideoTags.user_id',
                            'VideoTags.status',
                            'VideoTags.slug',
                            
                            'Videos.provider_id',
                            'Videos.video_url',
                            'Videos.duration',
                            'Videos.id',
                        ])
                        ->contain([
                            'Videos' => $queryVideo,
                            'Tags' => $queryTags,
                            'Riders' => $queryRiders
        ]);
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator) {
        $validator
                ->add('id', 'valid', ['rule' => 'numeric'])
                ->allowEmpty('id', 'create');

        $validator
                ->add('begin', 'decimal', ['rule' => 'decimal'])
                ->add('begin', 'postive', [
                    'rule' => function ($value, $context) {
                        return $value >= 0;
                    },
                    'message' => 'Begin time must be a positive number.'
                ])
                ->requirePresence('begin', 'create')
                ->notEmpty('begin');

        $validator
                ->add('end', 'trick_duration', [
                    'rule' => function ($value, $context) {
                        if ($value < self::MIN_TAG_DURATION) {
                            return false;
                        }
                        if (isset($context['data']['begin'])) {
                            $duration = $value - $context['data']['begin'];
                            return $duration >= self::MIN_TAG_DURATION &&
                                    $duration <= self::MAX_TAG_DURATION;
                        }
                        return true;
                    },
                    'message' => 'The trick duration must be between ' . self::MIN_TAG_DURATION . ' and ' .
                    self::MAX_TAG_DURATION . ' seconds.'
                ])
                ->add('end', 'decimal', ['rule' => 'decimal'])
                ->requirePresence('end', 'create')
                ->notEmpty('end');

        $validator
                ->requirePresence('user_id', 'create')
                ->notEmpty('user_id', 'create')
                ->allowEmpty('user_id', 'update');

        $validator
                ->requirePresence('video_id', 'create')
                ->notEmpty('video_id');

        $validator
                ->requirePresence('tag_id', 'create')
                ->notEmpty('tag_id');



        return $validator;
    }

    function findSimilarTags($videoId, $begin, $end) {
        $beginMin = $begin + self::SIMILARITY_PRECISION_SECONDS;
        $endMin = $begin - self::SIMILARITY_PRECISION_SECONDS;
        $beginMax = $begin - self::SIMILARITY_PRECISION_SECONDS;
        $endMax = $end + self::SIMILARITY_PRECISION_SECONDS;
        return $this->findAndJoin()
                        ->where([
                            'video_id' => $videoId,
                            'OR' => [
                                // Include inside bigger tag
                                ['VideoTags.begin <= ' => $beginMin, 'VideoTags.end >= ' => $endMin],
                                // Contain bigger tag
                                ['VideoTags.begin >= ' => $beginMax, 'VideoTags.end <= ' => $endMax]
                            ]
        ]);
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules) {
//        $rules->add($rules->existsIn(['video_id'], 'Videos'));
        $rules->add($rules->existsIn(['tag_id'], 'Tags'));
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        $rules->add($rules->existsIn(['rider_id'], 'Riders'));

        // Check exists in video id and duration > 
        $rules->add(function ($entity) {
            $videoTable = \Cake\ORM\TableRegistry::get('Videos');
            try {
                $video = $videoTable->getPublic($entity->video_id);
                $entity->errors('video_id', ['This video does not exists']);
                if ($video->duration < $entity->end) {
                    \Cake\Log\Log::error('User is trying to add a video tag with an end time greater '
                            . 'than the video duration (user_id= ' . $entity->user_id . ', '
                            . 'video_id=' . $entity->video_id . ',video_duration= ' . $video->duration . ')', ['messages']);
                    $entity->errors('end', ['Invalid end time']);
                    return false;
                }
                return true;
            } catch (\Cake\Network\Exception\RecordNotFoundException $ex) {
                $entity->errors('video_id', ['Invalid video']);
                return false;
            }
        }, 'video_exists_and_duration');
//        , [
//            'errorField' => 'status',
//            'message' => 'This invoice cannot be moved to that status.'
//        ]);
        // Checking similar tags
//        $rules->add(function($entity, $scope) {
//            if ($entity->isNew() || $entity->dirty('begin') || $entity->dirty('end')) {
//                if ($scope['repository']->existsSimilarValidated($entity)) {
//                    $entity->errors('begin', ['There is already a validated trick here']);
//                    return false;
//                }
//            }
//            return true;
//        });
        return $rules;
    }

    /**
     * Returns true if there is a similar tags already validated
     * @param \App\Model\Entity\VideoTag $entity
     * @return boolean
     */
    public function existsSimilarValidated(\App\Model\Entity\VideoTag $entity) {
        $conditions = [
            'VideoTags.video_id' => $entity->video_id,
            'VideoTags.status' => VideoTag::STATUS_VALIDATED,
            '(LEAST(' . $entity->end . ', end) - GREATEST(' . $entity->begin . ', begin))/(end - begin) > '
            . self::SIMILARITY_RATIO_THRESHOLD,
        ];
        if (!$entity->isNew()) {
            $conditions['VideoTags.id !='] = $entity->id;
        }
        return $this->exists($conditions);
    }

    /**
     * @param \Cake\ORM\Entity $entity
     */
    private function createTag($data, $userId) {
        $tagsTable = \Cake\ORM\TableRegistry::get('Tags');
        return $tagsTable->createOrGet($tagsTable->newEntity($data), $userId);
    }

    public function saveWithTag($entity, $userId, $data, $fieldList = ['rider_id', 'begin', 'end', 'tag_id', 'video_id']) {

        if (!empty($data['tag']) && is_array($data['tag'])) {
            $data['tag_id'] = $this->createTag($data['tag'], $userId)->id;
            unset($data['tag']);
        }
        if ($entity == null) {
            $entity = $this->newEntity($data, [
                'fieldList' => $fieldList,
                'validate' => true
            ]);
        } else {
            $this->patchEntity($entity, $data, [
                'fieldList' => $fieldList,
                'validate' => true
            ]);
        }
        if ($userId !== null) {
            $entity->user_id = $userId;
        }
        return $entity;
    }

    /**
     * @param \App\Model\Table\Event $event
     * @param \Cake\ORM\Entity $entity
     * @param \App\Model\Table\ArrayObject $options
     */
    public function beforeSave($event, $entity, $options) {
        if ($entity->status === VideoTag::STATUS_BLOCKED) {
            $event->stopPropagation();
            $entity->errors('status', ['You are not authorized to edit this trick']);
            return false;
        }

        $entity->_delete_accuracy_rates = false;
        $now = date('c');
        $entity->modified = $now;
        if ($entity->isNew() && empty($entity->status)) {
            $entity->created = $now;
            if ($this->existsSimilarValidated($entity)) {
                $entity->status = VideoTag::STATUS_DUPLICATE;
            } else {
                $entity->status = VideoTag::STATUS_PENDING;
            }
        } else if (!$entity->isNew() &&
                ($entity->status === VideoTag::STATUS_REJECTED || $entity->status === VideoTag::STATUS_PENDING)) {
            // Reset counter
            if ($this->existsSimilarValidated($entity)) {
                $entity->status = VideoTag::STATUS_DUPLICATE;
            }
        }
        $this->modified = date('c');
    }

    /**
     * @param \App\Model\Table\Event $event
     * @param \Cake\ORM\Entity $entity
     * @param \App\Model\Table\ArrayObject $options
     */
    public function afterSave($event, $entity, $options) {
        // Delete all user rates
        if ($entity->_delete_accuracy_rates) {
            $accuracyRatesTable = \Cake\ORM\TableRegistry::get('VideoTagAccuracyRates');
            $accuracyRatesTable->deleteAll([
                'video_tag_id' => $entity->id
            ]);
        }
    }

    public function updateSlug($id) {
        $entity = $this->get($id, [
            'contain' => ['Riders', 'Tags']
        ]);
        $entity->generateSlug($entity->rider, $entity->tag);
        return $this->save($entity);
    }

}
