<?php

namespace App\Model\Table;

use App\Model\Entity\Playlist;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use App\Lib\JsonConfigHelper;


/**
 * Playlists Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Users
 * @property \Cake\ORM\Association\HasMany $PlaylistVideoTags
 */
class PlaylistsTable extends Table {

    const CACHE_GROUP_TRENDING = 'playliststrending';
    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config) {
        parent::initialize($config);

        $this->table('playlists');
        $this->displayField('title');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('Users', [
            'foreignKey' => 'user_id'
        ]);
        $this->hasMany('PlaylistVideoTags', [
            'foreignKey' => 'playlist_id'
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
                ->requirePresence('title', 'create')
                ->notEmpty('title')
                ->add('title', [
                    'maxLength' => [
                        'rule' => ['maxLength', JsonConfigHelper::rules("playlists", "title", "max_length")],
                        'message' => 'Choose a shorter title.'
                    ],
                    'minLength' => [
                        'rule' => ['minLength', JsonConfigHelper::rules("playlists", "title", "min_length")],
                        'message' => 'Choose a longer title.'
                    ]
                ]);

        $validator
                ->allowEmpty('description')
                ->add('description', [
                    'maxLength' => [
                        'rule' => ['maxLength', JsonConfigHelper::rules("playlists", "description", "max_length")],
                        'message' => 'Your description is too long.'
                    ]
                ]);

        $validator
                ->requirePresence('status', 'create')
                ->notEmpty('status')
                ->add('status', [
                    'inList' => [
                        'rule' => ['inList', [Playlist::STATUS_PRIVATE, Playlist::STATUS_PUBLIC]],
                        'message' => 'Invalid status.'
                    ]
                ]);

        return $validator;
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules) {
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        return $rules;
    }

    public function findPublic() {
        return $this->find('all')->where(['Playlists.status' => Playlist::STATUS_PUBLIC, 'Playlists.count_tags > 1']);
    }
    
    public function findOwner($userId, $query = null) {
        if ($query === null) {
            $query = $this->find('all');
        }
        return $query->where([
            'Playlists.status IN ' => [Playlist::STATUS_PRIVATE, Playlist::STATUS_PUBLIC], 
            'Playlists.user_id' => $userId
        ]);
    }

    public function findVisible($userId = null, $query = null) {
        if ($query === null) {
            $query = $this->find('all');
        }
        return $query->where([
                    'OR' => [
                        ['Playlists.status' => Playlist::STATUS_PUBLIC],
                        ['Playlists.status IN ' => [Playlist::STATUS_PRIVATE,Playlist::STATUS_PUBLIC], 'Playlists.user_id' => $userId]]
        ]);
    }

    public function getEditabled($id, $userId = null) {
        if ($id === null || $userId === null) {
            throw new \Cake\Network\Exception\NotFoundException();
        }
        $playlist = $this->get($id);
        if ($playlist->user_id !== $userId || $playlist->status === Playlist::STATUS_BLOCKED) {
            throw new \Cake\Network\Exception\NotFoundException();
        }
        return $playlist;
    }

    public function findEditabled($userId = null, $query = null) {
        if ($query === null) {
            $query = $this->find('all');
        }
        return $query->where([
                    'Playlists.status !=' => Playlist::STATUS_BLOCKED,
                    'Playlists.user_id' => $userId
        ]);
    }

    
    /**
     * @param \App\Model\Table\Event $event
     * @param \Cake\ORM\Entity $entity
     * @param \App\Model\Table\ArrayObject $options
     */
    public function beforeSave($event, $entity, $options) {
//        if ($entity->dirty('title')){
//            $entity->slug = \Cake\Utility\Inflector::slug($entity->title);
//        }
    }

    public function findTrending($limit = 5){
        return $this->findPublic()
                    ->where(['Playlists.count_points >=' => 2])
                    ->order(['Playlists.count_points DESC'])
                    ->limit($limit)
                    ->cache('playlists', 'oneHourCache');
    }
}
