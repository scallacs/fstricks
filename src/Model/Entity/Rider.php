<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Rider Entity.
 *
 * @property int $id
 * @property string $firstname
 * @property string $lastname
 * @property string $picture
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property bool $level
 * @property string $provider_uid
 * @property string $social_provider_id
 * @property \App\Model\Entity\SocialProvider $social_provider
 * @property \App\Model\Entity\VideoTag[] $video_tags
 */
class Rider extends Entity
{
    
    public static $levels = [];
    
    protected $_virtual = [
        'picture_portrait', 
        'picture_square', 
        'picture_original',
        'display_name',
        'level_string'
    ];

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        '*' => true,
        'id' => false
    ];
    
    protected static $mapLevels = null;
            
    public function _getLevelString(){
        if (self::$mapLevels === null){
            self::initMapLevels();
        }
        return isset(self::$mapLevels[$this->level]) ? self::$mapLevels[$this->level] : 'Unknown';
    }
    
    protected static function initMapLevels(){
        $map = \App\Lib\JsonConfigHelper::rules('riders', 'level', 'values');
        foreach ($map as $v){
            self::$mapLevels[$v['code']] = $v['name'];
        }
    }


    public function _getDisplayName(){
        return $this->firstname.' '.$this->lastname;
    }
    
    private function getPicturePath($prefix = ''){
        return 'files/riders/picture/'.$this->picture_dir.'/'.$prefix.(!empty($prefix) ? '_' : '').$this->picture;
    }


    public function _getPictureOriginal(){
        if (!empty($this->picture)){
            return $this->getPicturePath();
        }
        else{
            return 'http://www.placehold.it/200x200/EFEFEF/AAAAAA&amp;text=no+profile+picture';
        }
    }
    public function _getPicturePortrait(){
        if (!empty($this->picture)){
            return $this->getPicturePath('portrait');
        }
        else{
            return 'http://www.placehold.it/200x200/EFEFEF/AAAAAA&amp;text=no+profile+picture';
        }
    }
    public function _getPictureSquare(){
        if (!empty($this->picture)){
            return $this->getPicturePath('square');
        }
        else{
            return 'http://www.placehold.it/100x300/EFEFEF/AAAAAA&amp;text=no+profile+picture';
        }
    }
}
