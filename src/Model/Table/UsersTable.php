<?php

namespace App\Model\Table;

use App\Model\Table\TableWithTags;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Users Model
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

        $this->table('users');
        $this->displayField('username');
        $this->primaryKey('id');

        $this->hasMany('Spots', [
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
                ->add('email', 'valid', ['rule' => 'email'])
                ->requirePresence('email', 'create')
                ->notEmpty('email')
                ->add('email', 'unique', ['rule' => 'validateUnique', 'provider' => 'table']);

        $validator
                ->requirePresence('username', 'create')
                ->notEmpty('username')
                ->add('username', 'unique', ['rule' => 'validateUnique', 'provider' => 'table']);

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
        $rules->add($rules->isUnique(['email']));
        $rules->add($rules->isUnique(['username']));
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
        $exists = $this->exists([
            'provider' => $provider,
            'provider_uid' => $data['identifier']
        ]);

        if (!$exists) {
            $entity = $this->newEntity();
            $entity->username = $data['displayName'];
            $entity->provider = $provider;
            $entity->status = \App\Model\Entity\User::STATUS_ACTIVATED;
            $entity->provider_uid = $data['identifier'];
            if ($this->save($entity, ['checkRules' => false])) {
                return $entity;
            }
        }

        return false;
    }

}
