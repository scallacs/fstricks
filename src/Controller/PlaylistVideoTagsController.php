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

    /**
     *
     * @param string|null $id Playlist Video Tag id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function add() {
        if ($this->request->is('post')) {
            $playlistVideoTag = $this->PlaylistVideoTags->newEntity($this->request->data);
            $playlistVideoTag->user_id = $this->Auth->user('id');
            
            if ($this->PlaylistVideoTags->save($playlistVideoTag)) {
                ResultMessage::setMessage(__('Added to playlist.'), true);
            } else {
                ResultMessage::setMessage(__('Cannot add to playlist. Please, try again.'), false);
            }
        }
    }

    /**
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function down($id = null) {
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
    public function delete($id = null) {
        $this->request->allowMethod(['post', 'delete']);
        $playlistVideoTag = $this->PlaylistVideoTags->get($id);
        if ($playlistVideoTag->user_id !== $this->Auth->user('id')) {
            throw new \Cake\Network\Exception\UnauthorizedException();
        }
        if ($this->PlaylistVideoTags->delete($playlistVideoTag)) {
            ResultMessage::setMessage(__('Removed from playlist'), true);
        } else {
            ResultMessage::setMessage(__('Cannot remove from playlist. Please, try again.'), false);
        }
    }

    private function move_relative($id, $value) {
        $playlistVideoTag = $this->PlaylistVideoTags->get($id);
        if ($playlistVideoTag->user_id !== $this->Auth->user('id')) {
            throw new \Cake\Network\Exception\UnauthorizedException();
        }
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
