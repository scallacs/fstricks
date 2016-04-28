<?php

namespace App\Model\Table;

use App\Model\Table\TableWithTags;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use App\Lib\JsonConfigHelper;

/**
 * Users Model
 *
 * https://github.com/burzum/cakephp-user-tools/blob/master/docs/Documentation/The-User-Behavior.md
 * 
 * @property \Cake\ORM\Association\HasMany $Spots
 */
class UsersTable extends TableWithTags {

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config) {
        parent::initialize($config);

        $this->addBehavior('Burzum/UserTools.User', [
            'emailConfig' => 'default',
            'initPasswordReset' => [
                'tokenLength' => 32,
                'expires' => '+1 day'
            ],
            'loginFields' => [
                'username' => 'email',
                'password' => 'password'
            ],
            'sendPasswordResetToken' => [
                'template' => 'password_reset',
            ],
        ]);

        $this->table('users');
        $this->displayField('username');
        $this->primaryKey('id');

        $this->hasMany('Playlists', [
            'foreignKey' => 'user_id'
        ]);

//        if (method_exists($this, 'searchManager')) {
//        }
    }

    public function initFilters($type = 'default') {
        $this->addBehavior('Search.Search');

        $this->searchManager()
                ->add('status', 'Search.Value', [
                    'field' => $this->aliasField('status')
                ])
                ->add('q', 'Search.Like', [
                    'before' => true,
                    'after' => true,
                    'field' => [$this->aliasField('username'), $this->aliasField('email')]
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
                ->add('email', 'valid', ['rule' => 'email'])
                ->requirePresence('email', 'create')
                ->notEmpty('email')
                ->add('email', 'unique', [
                    'rule' => 'validateUnique',
                    'provider' => 'table',
                    'message' => 'There is already an account with this email.']);

        $validator
                ->requirePresence('username', 'create')
                ->notEmpty('username')
                ->add('username', [
                    'minLength' => [
                        'rule' => ['minLength', JsonConfigHelper::rules('users', 'username', 'min_length')],
                        'message' => 'Choose a longer name.'
                    ],
                    'maxLength' => [
                        'rule' => ['maxLength', JsonConfigHelper::rules('users', 'username', 'max_length')],
                        'message' => 'Choose a shorter name.'
                    ],
                    'allowedChars' => [
                        'rule' => function($value, $context) {
                            return !preg_match(JsonConfigHelper::rules('users', 'username', 'regex'), $value);
                        },
                        'message' => 'Only alpha numeric chars with accents.'
            ]])
                ->add('username', 'unique', [
                    'rule' => 'validateUnique',
                    'provider' => 'table',
                    'message' => 'This user name is not available. Please choose another one.'
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
//        $rules->add($rules->isUnique(['email'], 'There is already an account with this email.'));
//        $rules->add($rules->isUnique(['username'], 'This user name is not available. Please choose another one.'));
        return $rules;
    }

    /**
     * Create the user social account if it does not exists yet
     * @param type $data
      'identifier' => '10208111125313888',
      'webSiteURL' => '',
      'profileURL' => '',
      'photoURL' => 'https://graph.facebook.com/10208111125313888/picture?width=150&height=150',
      'displayName' => 'StÃ©phane LÃ©onard',
      'description' => '',
      'firstName' => '',
      'lastName' => '',
      'gender' => '',
      'language' => '',
      'age' => null,
      'birthDay' => null,
      'birthMonth' => null,
      'birthYear' => null,
      'email' => '',
      'emailVerified' => '',
      'phone' => null,
      'address' => null,
      'country' => null,
      'region' => '',
      'city' => null,
      'zip' => null,
      'username' => '',
      'coverInfoURL' => ''
     */
    public function createSocialAccount($provider, $data) {
        $condition = [
            'provider' => $provider,
            'provider_uid' => $data['identifier']
        ];
        if (!empty($data['email'])) {
            $condition = [
                'OR' => [
                    $condition,
                    ['email' => $data['email']]
                ]
            ];
        }
        $user = $this->find()
                ->where($condition)
                ->limit(1)
                ->first();

        if (!empty($user) && !empty($user->email)) {
            return $user;
        }

        $entity = $this->newEntity();
        $entity->email = $data['email'];
        $entity->username = $data['displayName'];
        $entity->provider = $provider;
        $entity->status = \App\Model\Entity\User::STATUS_ACTIVATED;
        $entity->provider_uid = $data['identifier'];
        return $this->save($entity, ['checkRules' => false]);
    }

    public function getUserWithPassword($id, $password) {
        $data = $this->get($id);
        if (empty($data) || !$this->passwordHasher()->check($password, $data->password)) {
            throw new \Cake\Datasource\Exception\RecordNotFoundException('Invalid password');
        }
        return $data;
    }

    public function search($q, $limit = 10) {
        return $this->find('all')
                        ->where([
                            'Users.username LIKE ' => '%' . $q . '%'
                        ])
                        ->limit($limit);
    }

    public function beforeSave($event, $entity, $options) {
        if ($entity->isNew()) {
            $entity->playlists = [];
            $tablePlaylists = \Cake\ORM\TableRegistry::get('Playlists');
            foreach (\Cake\Core\Configure::read('Users.default_playlists') as $data) {
                $entity->playlists[] = $tablePlaylists->newEntity($data);
            }
        }
    }

}
