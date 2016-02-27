<?php
namespace App\Model\Table;

use App\Model\Entity\PlaylistVideoTag;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * PlaylistVideoTags Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Playlists
 * @property \Cake\ORM\Association\BelongsTo $VideoTags
 */
class PlaylistVideoTagsTable extends Table
{

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->table('playlist_video_tags');
        $this->displayField('playlist_id');
        $this->primaryKey(['playlist_id', 'video_tag_id']);

        $this->belongsTo('Playlists', [
            'foreignKey' => 'playlist_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('VideoTags', [
            'foreignKey' => 'video_tag_id',
            'joinType' => 'INNER'
        ]);
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
            ->add('position', 'valid', ['rule' => 'numeric'])
            ->requirePresence('position', 'create')
            ->notEmpty('position');

        return $validator;
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
        $rules->add($rules->existsIn(['playlist_id'], 'Playlists'));
        $rules->add($rules->existsIn(['video_tag_id'], 'VideoTags'));
        return $rules;
    }
}
