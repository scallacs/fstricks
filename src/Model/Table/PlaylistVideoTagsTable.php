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
        $this->primaryKey('id');

        $this->belongsTo('Playlists', [
            'foreignKey' => 'playlist_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('VideoTags', [
            'foreignKey' => 'video_tag_id',
            'joinType' => 'INNER'
        ]);
        
        $this->addBehavior('ADmad/Sequence.Sequence', [
            'order' => 'position', // Field to use to store integer sequence. Default "position".
            'scope' => ['playlist_id'], // Array of field names to use for grouping records. Default [].
            'start' => 1, // Initial value for sequence. Default 1.
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
            ->requirePresence('video_tag_id', true)
            ->notEmpty('video_tag_id');
        $validator
            ->requirePresence('playlist_id', true)
            ->notEmpty('playlist_id');

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
        $rules->add($rules->isUnique(['video_tag_id', 'playlist_id']));
        return $rules;
    }
    
    
    public function findEditabled($id, $userId){
        return $this->find('all')
                ->where([
                    'PlaylistVideoTags.id' => $id
                ])
                ->matching('Playlists', function($q) use ($userId) {
                        return \Cake\ORM\TableRegistry::get('Playlists')
                                ->findEditabled($userId, $q)
                                ->select(['Playlists.id', 'Playlists.user_id', 'Playlists.status']);
                    }
                )
                ->limit(1);
    }
    public function getEditabled($id, $userId){
        $data = $this->findEditabled($id, $userId)
                ->first();
        if (empty($data)){
            throw new \Cake\Network\Exception\NotFoundException();
        }
        return $data;
    }
}
