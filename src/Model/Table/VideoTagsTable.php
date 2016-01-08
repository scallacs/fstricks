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

    const MIN_TAG_DURATION = 3;
    const MAX_TAG_DURATION = 30;
    
    /**
     * Find data for tags and do joins 
     * 
     * @param query | null $queryVideo 
     * @param query | null $queryTags
     * @return query
     */
    public function findAndJoin($queryVideo = null, $queryTags = null){
        if ($queryVideo === null){
            $queryVideo = function($q){
                return $q;
            };
        }
        if ($queryTags === null){
            $queryTags = function($q){
                        return $q
                            ->select([
                                'category_name' => 'Categories.name',
                                'sport_name' => 'Sports.name',
                                'tag_name' => 'Tags.name',
                            ])
                            ->contain(['Sports', 'Categories']);
                    };
        }
        return $this->find('all')
                ->select([
                    'tag_slug' => 'Tags.slug',
                    'tag_name' => 'Tags.name',
                    'count_points' => 'VideoTags.count_points',
                    'id' => 'VideoTags.id',
                    'provider_id' => 'Videos.provider_id',
                    'video_url' => 'Videos.video_url',
                    'video_id' => 'Videos.id',
                    'begin' => 'VideoTags.begin',
                    'end' => 'VideoTags.end'
                    ])
                ->where([
                    'status' => 'validated',
                ])
                ->contain([
                    'Videos' => $queryVideo, 
                    'Tags' => $queryTags
                ]);
    }
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
        $this->belongsTo('Users', [
            'foreignKey' => 'user_id'
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
                ->add('begin', 'valid', ['rule' => 'decimal'])
                ->requirePresence('begin', 'create')
                ->notEmpty('begin');

        $validator
                ->add('end', 'trick_duration', [
                    'rule' => function ($value, $context) {
                        if (isset($context['data']['begin'])){
                            $duration = $value - $context['data']['begin'];
                            return $duration >= self::MIN_TAG_DURATION &&
                                    $duration <= self::MAX_TAG_DURATION;
                        }
                        return true;
                    },
                    'message' => 'The trick duration must be between '. self::MIN_TAG_DURATION . ' and '. 
                            self::MAX_TAG_DURATION.' seconds.'
                ])
//                ->add('end', 'similar_tags', [
//                    'rule' => function ($value, $context) {
//                        // Check if there are similar tag for the same video
//                        if (isset($context['data']['video_id'])){
//
//                        }
//                    },
//                    'message' => 'There is already a tag for this trick.'
//                ])
                ->add('end', 'valid', ['rule' => 'decimal'])
                ->requirePresence('end', 'create')
                ->notEmpty('end');

        $validator
                ->requirePresence('user_id', 'create')
                ->notEmpty('user_id');

        $validator
                ->requirePresence('video_id', 'create')
                ->notEmpty('video_id');

        $validator
                ->requirePresence('tag_id', 'create')
                ->notEmpty('tag_id');


        return $validator;
    }

    
    const SIMILARITY_PRECISION_SECONDS = 2;
    function findSimilarTags($videoId, $begin, $end){
        $beginMin = $begin + self::SIMILARITY_PRECISION_SECONDS;
        $endMin = $begin - self::SIMILARITY_PRECISION_SECONDS;
        $beginMax = $begin - self::SIMILARITY_PRECISION_SECONDS;
        $endMax = $end + self::SIMILARITY_PRECISION_SECONDS;
        return $this->find('all')
                ->where([
                    'video_id' => $videoId,
                    'OR' => [
//                        // Similar start or end
//                        ['VideoTags.begin >=' => $beginMin, 'VideoTags.begin <= ' => $beginMax], 
//                        ['VideoTags.end >=' => $endMin, 'VideoTags.begin <= ' => $endMax],
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
        $rules->add($rules->existsIn(['video_id'], 'Videos'));
        $rules->add($rules->existsIn(['tag_id'], 'Tags'));
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        return $rules;
    }

}
