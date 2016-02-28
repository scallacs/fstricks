<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;

/**
 * PlaylistVideoTags Controller
 *
 * @property \App\Model\Table\PlaylistVideoTagsTable $PlaylistVideoTags
 */
class PlaylistVideoTagsController extends AppController {

    public function initialize() {
        parent::initialize();
        $this->Playlists = \Cake\ORM\TableRegistry::get('Playlists');
    }

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['playlist']);
    }

    /**
     * Find all elements of a playlist
     * @param type $playlistId
     * @throws \Cake\Network\Exception\NotFoundException
     */
    public function playlist($playlistId = null) {
        $playlist = $this->Playlists
                ->findVisible($this->Auth->user('id'))
                ->where(['Playlists.id' => $playlistId]);
        if (empty($playlist)) {
            throw new \Cake\Network\Exception\NotFoundException();
        }
        $data = $this->PlaylistVideoTags
                ->find('all')
                ->where([
                    'PlaylistVideoTags.playlist_id' => $playlistId
                ])
                ->order(['PlaylistVideoTags.position ASC']);

        ResultMessage::setWrapper(false);
        ResultMessage::overwriteData($data);
    }

    /**
     *
     * @param string|null $id Playlist Video Tag id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function add() {
        if ($this->request->is('post') && \App\Lib\DataUtil::isPositiveInt($this->request->data, 'playlist_id')) {
            $playlistId = $this->request->data['playlist_id'];

            // Check user authorized to add in this playlist
            $playlist = $this->Playlists->getEditabled($playlistId, $this->Auth->user('id'));
            $playlistVideoTag = $this->PlaylistVideoTags->newEntity($this->request->data);

//            debug($playlistVideoTag);
            if ($this->PlaylistVideoTags->save($playlistVideoTag)) {
                ResultMessage::setMessage(__('Added to playlist.'), true);
            } else {
                ResultMessage::addValidationErrorsModel($playlistVideoTag, true);
            }
        }
    }

    /**
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function down($id = ull) {
        $this->move_relative($id, -1);
    }

    /**
     * Edit method
     *
     * @param string|null $id Playlist Video Tag id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function up($id = null) {
        $this->move_relative($id, 1);
    }

    /**
     *
     * @param string|null $id Playlist Video Tag id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id) {
        $this->request->allowMethod(['post', 'delete']);
        $playlistVideoTag = $this->PlaylistVideoTags->getEditabled($id, $this->Auth->user('id'));
        if ($this->PlaylistVideoTags->delete($playlistVideoTag)) {
            ResultMessage::setMessage(__('Removed from playlist'), true);
        } else {
            ResultMessage::setMessage(__('Cannot remove from playlist. Please, try again.'), false);
        }
    }

    private function move_relative($id, $value) {

        $playlistVideoTag = $this->PlaylistVideoTags
                ->getEditabled($id, $this->Auth->user('id'));
        
        if ($this->request->is('post')) {
            $playlistVideoTag->position = $playlistVideoTag->postion + $value;
            if ($this->PlaylistVideoTags->save($playlistVideoTag)) {
                ResultMessage::setMessage(__('The playlist video tag has been saved.'), true);
            } else {
                ResultMessage::setMessage(__('The playlist video tag could not be saved. Please, try again.'), false);
            }
        }
    }

}
