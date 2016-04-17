<?php

namespace App\Model\Table;

use App\Model\Entity\Rider;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use App\Lib\JsonConfigHelper;

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
                'dir' => 'picture_dir', // The name of the field to store the folder
                'thumbnailSizes' => [ // Declare your thumbnails
                    'square' => [   // Define the prefix of your thumbnail
                        'w' => 200, // Width
                        'h' => 200, // Height
                        'crop' => true, // Crop will crop the image as well as resize it
                        'jpeg_quality' => 100,
                        'png_compression_level' => 9
                    ],
                    'portrait' => [     // Define a second thumbnail
                        'w' => 200,
                        'h' => 400,
//                        'crop' => true, 
                        'png_compression_level' => 9
                    ]
                ],
                'thumbnailMethod' => 'Gd'  // Options are Imagick, Gd or Gmagick
            ]
        ]);


        $listener = new \App\Event\UpdatePictureListener();
        $this->eventManager()->on($listener);
    }

    public function initFilters($type = 'default') {
        $this->addBehavior('Search.Search');

        $this->searchManager()
//                ->add('user_id', 'Search.Value')
//                ->add('category_id', 'Search.Value')
//                ->add('sport_id', 'Search.Value')
                ->add('q', 'Search.Like', [
                    'before' => true,
                    'after' => true,
                    'field' => [$this->aliasField('firstname'), $this->aliasField('lastname')]
        ]);
        if ($type === 'admin') {
            $this->searchManager()
                ->add('status', 'Search.Value');
        }
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

        $validator->allowEmpty('user_id');
        $validator->allowEmpty('picture');

        $validator
                ->requirePresence('nationality', 'create')
                ->add('nationality', 'custom', [
                    'rule' => function ($value, $context) {
                $countries = JsonConfigHelper::countries();
                foreach ($countries as $county) {
                    if ($county['code'] === $value) {
                        return true;
                    }
                }
                return false;
            },
                    'message' => 'Choose a valid nationality'
        ]);

        $validator
                ->requirePresence('firstname', 'create')
                ->add('firstname', [
                    'minLength' => [
                        'rule' => ['minLength', JsonConfigHelper::rules("riders", "firstname", "min_length")],
                        'message' => 'Choose a longer name.'
                    ],
                    'maxLength' => [
                        'rule' => ['maxLength', JsonConfigHelper::rules("riders", "firstname", "max_length")],
                        'message' => 'Choose a shorter name.'
                    ]
                ])
                ->notEmpty('firstname');

        $validator
                ->requirePresence('lastname', 'create')
                ->add('lastname', [
                    'minLength' => [
                        'rule' => ['minLength', JsonConfigHelper::rules("riders", "lastname", "min_length")],
                        'message' => 'Choose a longer name.'
                    ],
                    'maxLength' => [
                        'rule' => ['maxLength', JsonConfigHelper::rules("riders", "lastname", "max_length")],
                        'message' => 'Choose a shorter name.'
                    ]
                ])
                ->notEmpty('lastname');

        $validator
                ->add('level', 'valid', ['rule' => function ($value) {
                $levels = JsonConfigHelper::rules("riders", "level", "values");
                foreach ($levels as $level) {
                    if ($level['code'] == $value) {
                        return true;
                    }
                }
                return false;
            }])
                ->requirePresence('level', 'create')
                ->notEmpty('level');


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
        $rules->add($rules->isUnique(['user_id']));
        $rules->add($rules->isUnique(['firstname', 'lastname', 'nationality'], "There is already a rider with the same name and nationality"));
        //$rules->add($rules->existsIn(['social_provider_id'], 'SocialProviders'));
        return $rules;
    }

    /**
     * @param \App\Model\Table\Event $event
     * @param \Cake\ORM\Entity $entity
     * @param \App\Model\Table\ArrayObject $options
     */
    public function beforeSave($event, $entity, $options) {
        // TODO move from here. Set in entity ? 
        if ($entity->isNew()) {
            $entity->firstname = \App\Lib\DataUtil::lowername($entity->firstname);
            $entity->lastname = \App\Lib\DataUtil::lowername($entity->lastname);
        }
//        else if (!empty($entity->picture)){
//            $config = $this->behaviors()->get('Proffer')->config();
//            // remove old picture 
//            $path = new \Proffer\Lib\ProfferPath($this, $entity, 'picture', $config['picture']);
//            $path->deleteFiles($path->getFolder(), false);
//        }
        $entity->nationality = \App\Lib\DataUtil::lowername($entity->nationality);
        $entity->slug = \Cake\Utility\Inflector::slug($entity->firstname . '-' . $entity->lastname . '-' . $entity->nationality);
    }

    public function findPublic($query = null) {
        if ($query){
            return $query;
        }
        return $this->find('all');
    }

    public function findForSitemap() {
        return $this->find('all')
                        ->order(['Riders.count_tags DESC'])
                        ->where([
                            'OR' => [
                                'Riders.count_tags >' => '1',
                                'Riders.status' => \App\Model\Entity\Rider::STATUS_VALIDATED
                            ]
                        ])
                        ->limit(50000);
    }
    
    public function findRiderSports($riderId) {
        $videoTags = \Cake\ORM\TableRegistry::get('VideoTags');
        return $videoTags->find()
                        ->select([
                            'count_ref' => 'COUNT(VideoTags.id)',
                            'Sports.id',
                            'Sports.name',
                            'Categories.id',
                            'Categories.name'
                        ])
                        ->where([
                            'VideoTags.status' => \App\Model\Entity\VideoTag::STATUS_VALIDATED,
                            'Videos.status' => \App\Model\Entity\Video::STATUS_PUBLIC,
                            'VideoTags.rider_id' => $riderId
                        ])
                        ->group(['Sports.id', 'Categories.id']) // , 'Categories.name', 'Sports.name'
                        ->contain(['Categories' => ['Sports'], 'Videos']);
    }

}
