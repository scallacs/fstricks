<?php

namespace App\Model\Table;

use App\Model\Entity\SocialProvider;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * SocialProviders Model
 *
 * @property \Cake\ORM\Association\HasMany $SocialAccounts
 */
class SocialProvidersTable extends Table {

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config) {
        parent::initialize($config);

        $this->table('social_providers');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->hasMany('SocialAccounts', [
            'foreignKey' => 'social_provider_id'
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
                ->allowEmpty('id', 'create');

        return $validator;
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
    public function createIfNotExists($provider, $data) {
        $exists = $this->exists([
            'social_provider_id' => $provider,
            'provider_uid' => $data['identifier']
        ]);

        if (!$exists) {
            // Create the user
            $users = \Cake\ORM\TableRegistry::get('Users');
            $user = $users->newEntity();
            $user['username'] = $data['displayName'];
            $user['status'] = \App\Model\Entity\User::STATUS_ACTIVATED;
            if (!$users->save($user, ['checkRules' => false])){
                return false;
            }
            $entity = $this->newEntity();
            $entity->scoial_provider_id = $provider;
            $entity->provider_uid = $data['identifier'];
            $entity->user_id = $user->id;
            return $this->save($entity);
        }
        
        return $exists;
    }

}
