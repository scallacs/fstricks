<?php

namespace App\Model\Table;

use App\Model\Entity\Playlist;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Playlists Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Users
 * @property \Cake\ORM\Association\HasMany $PlaylistVideoTags
 */
class PlaylistsTable extends Table {

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
        $this->addBehavior('ADmad/Sequence.Sequence', [
            'order' => 'position', // Field to use to store integer sequence. Default "position".
            'scope' => ['video_tag_id'], // Array of field names to use for grouping records. Default [].
            'start' => 1, // Initial value for sequence. Default 1.
        ]);


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
                ->notEmpty('title');

        $validator
                ->allowEmpty('description');

        $validator
                ->requirePresence('status', 'create')
                ->notEmpty('status');

        $validator
                ->add('count_points', 'valid', ['rule' => 'numeric'])
                ->requirePresence('count_points', 'create')
                ->notEmpty('count_points');

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
        return $this->find('all')->where(['Playlist.status' => Playlist::STATUS_PUBLIC]);
    }

}
