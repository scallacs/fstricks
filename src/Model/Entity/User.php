<?php

namespace App\Model\Entity;

use Cake\ORM\Entity;
use Cake\Auth\PasswordHasherFactory;

/**
 * User Entity.
 */
class User extends Entity {

    const STATUS_ACTIVATED = 'activated';

    protected $_virtual = ['avatar_url'];

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     * Note that '*' is set to true, which allows all unspecified fields to be
     * mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        'id' => false,
        'password' => true,
        'username' => true,
        'email' => true
    ];
    

    protected function _getAvatarUrl() {
        return \Cake\Routing\Router::url('/img/icon_avatar.png', true);
    }

    protected function _setUsername($value) {
        return mb_strtolower($value);
    }

}
