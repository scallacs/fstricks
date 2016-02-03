<?php

namespace App\Model\Table;

use App\Model\Entity\Rider;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Riders Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Users
 * @property \Cake\ORM\Association\BelongsTo $SocialProviders
 * @property \Cake\ORM\Association\HasMany $VideoTags
 */
class RidersTable extends Table {

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config) {
        parent::initialize($config);

        $this->table('riders');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->belongsTo('Users', [
            'foreignKey' => 'user_id'
        ]);
        $this->hasMany('VideoTags', [
            'foreignKey' => 'rider_id'
        ]);
        
        // Add the behaviour and configure any options you want
        $this->addBehavior('Proffer.Proffer', [
            'picture' => [    // The name of your upload field
                'root' => WWW_ROOT . 'files', // Customise the root upload folder here, or omit to use the default
                'dir' => 'picture_dir',   // The name of the field to store the folder
                'thumbnailSizes' => [ // Declare your thumbnails
                    'square' => [   // Define the prefix of your thumbnail
                        'w' => 200, // Width
                        'h' => 200, // Height
                        'crop' => true,  // Crop will crop the image as well as resize it
                        'jpeg_quality'  => 100,
                        'png_compression_level' => 9
                    ],
                    'portrait' => [     // Define a second thumbnail
                        'w' => 100,
                        'h' => 300
                    ],
                ],
                'thumbnailMethod' => 'Gd'  // Options are Imagick, Gd or Gmagick
            ]
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
                ->requirePresence('firstname', 'create')
                ->add('firstname', [
                    'minLength' => [
                        'rule' => ['minLength', 2],
                        'message' => 'Choose a longer name.'
                    ],
                    'maxLength' => [
                        'rule' => ['maxLength', 20],
                        'message' => 'Choose a shorter name.'
                    ]
                ])
                ->notEmpty('firstname');

        $validator
                ->requirePresence('lastname', 'create')
                ->add('lastname', [
                    'minLength' => [
                        'rule' => ['minLength', 2],
                        'message' => 'Choose a longer name.'
                    ],
                    'maxLength' => [
                        'rule' => ['maxLength', 20],
                        'message' => 'Choose a shorter name.'
                    ]
                ])
                ->notEmpty('lastname');

        $validator
                ->allowEmpty('picture');

        $validator
                ->add('is_pro', 'valid', ['rule' => 'boolean'])
                ->requirePresence('is_pro', 'create')
                ->notEmpty('is_pro');


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
        //$rules->add($rules->existsIn(['social_provider_id'], 'SocialProviders'));
        return $rules;
    }
    
    /**
     * @param \App\Model\Table\Event $event
     * @param \Cake\ORM\Entity $entity
     * @param \App\Model\Table\ArrayObject $options
     */
    public function beforeSave($event, $entity, $options){
        if (!empty($entity->firstname) && !empty($entity->lastname)){
            $entity->firstname = strtolower($entity->firstname);
            $entity->lastname = strtolower($entity->lastname);
            $entity->slug = \Cake\Utility\Inflector::slug($entity->firstname.'-'.$entity->lastname);
        }
    }

}
