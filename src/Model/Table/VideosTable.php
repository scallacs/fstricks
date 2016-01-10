<?php
namespace App\Model\Table;

use App\Model\Entity\Video;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use App\Lib\YoutubeRequest;


/**
 * Videos Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Videos
 * @property \Cake\ORM\Association\BelongsTo $VideoProviders
 * @property \Cake\ORM\Association\BelongsTo $Users
 * @property \Cake\ORM\Association\HasMany $VideoTags
 * @property \Cake\ORM\Association\HasMany $Videos
 */
class VideosTable extends Table
{
    

    public function search($videoId, $provider) {
        return $this->find('all')->where(['video_url' => $videoId, 'provider_id' => $provider])->limit(1);
    }

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->table('videos');
        $this->displayField('id');
        $this->primaryKey('id');

//        $this->belongsTo('Videos', [
//            'foreignKey' => 'video_id',
//            'joinType' => 'INNER'
//        ]);
//        $this->belongsTo('VideoProviders', [
//            'foreignKey' => 'provider_id',
//            'joinType' => 'INNER'
//        ]);
        $this->belongsTo('Users', [
            'foreignKey' => 'user_id'
        ]);
        $this->belongsTo('VideoProviders', [
            'foreignKey' => 'provider_id'
        ]);
        $this->hasMany('VideoTags', [
            'foreignKey' => 'video_id'
        ]);
//        $this->hasMany('Videos', [
//            'foreignKey' => 'video_id'
//        ]);
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator)
    {
        $validator
            ->add('id', 'valid', ['rule' => 'numeric'])
            ->allowEmpty('id', 'create');

        $validator
//            ->add('provider_id', 'providerValid', [
//                'rule' => ['inList', array_column(\Cake\Core\Configure::read('videoProviders'), 'name')],
//                'message' => 'Invalid provider. Please choose available provider from the list'
//            ])
            ->requirePresence('provider_id', 'create')
            ->notEmpty('provider_id');

        $validator
            ->requirePresence('user_id', 'create')
            ->notEmpty('user_id');

        $validator
            ->requirePresence('video_url', 'create')
            ->notEmpty('video_url')
            ->add('video_url', 'custom', [
                'rule' => function ($value, $context) {
                    // $context['data']['provider_id']
                    return $this->videoExists($value);
                },
                'message' => 'The video id is invalid'
            ]);

        return $validator;
    }
    
    private function videoExists($url) {
        // TODO youtube key as global variable
        try {
            $youtube = new YoutubeRequest(array('key' => \Cake\Core\Configure::read('Youtube.key')));
            $video = $youtube->getVideoInfo(YoutubeRequest::urlToId($url));
            if (!isset($video->status)){
                return false;
            }
            $status = $video->status;
            return isset($status->embeddable) && $status->embeddable
                    && isset($status->privacyStatus) && $status->privacyStatus === 'public';
        } catch (Exception $e) { }
        return false;
    }
    
    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules)
    {
//        $rules->add($rules->existsIn(['provider_id'], 'VideoProviders'));
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        $rules->add($rules->existsIn(['provider_id'], 'VideoProviders'));
        $rules->add($rules->isUnique(['video_url', 'provider_id'], 'This video is already in the database'));
        return $rules;
    }
}
