<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;

/**
 * Playlists Controller
 *
 * @property \App\Model\Table\PlaylistsTable $Playlists
 */
class PlaylistsController extends AppController {

    public function initialize() {
        parent::initialize();
        $this->loadComponent('Paginator');
    }

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['index', 'view', 'search', 'trending']);
    }

    /**
     * Playlists created by the user
     *
     * @return void
     */
    public function user() {
        $this->Paginator->config(\Cake\Core\Configure::read('Pagination.Playlists'));
        $query = $this->Playlists
                ->findOwner($this->Auth->user('id'))
                ->order(['Playlists.modified DESC']);
        ResultMessage::setPaginateData(
                $this->paginate($query),
                $this->request->params['paging']['Playlists']);
    }

    /**
     * Index method
     *
     * @return void
     */
    public function index() {
        $this->Paginator->config(\Cake\Core\Configure::read('Pagination.Playlists'));
        $query = $this->Playlists->findPublic()
                ->order(['Playlists.count_points DESC']);
        ResultMessage::setPaginateData(
                $this->paginate($query), $this->request->params['paging']['Playlists']);
    }

    /**
     * @queryType GET
     * 
     * Return a list of the most famous playlists begining by the search term $term
     * @param string $term
     */
    public function search() {
        ResultMessage::setWrapper(false);
        if ($this->request->is('get') && !empty($this->request->query['q'])) {
            $data = $this->request->query;
            $query = $this->Playlists->findPublic()
                    ->select([
                        'title' => 'Playlists.title',
                        'slug' => 'Playlists.slug',
                        'count_points' => 'Playlists.count_points',
                        'id' => 'Playlists.id',
                    ])
                    ->order(['Playlists.count_points DESC'])
                    ->limit(10);
            \App\Model\Table\TableUtil::multipleWordSearch($query, $data['q'], 'Playlists.title');
            ResultMessage::overwriteData($query->all());
        }
    }

    /**
     * View method
     *
     * @param string|null $id Playlist id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null) {
        ResultMessage::setWrapper(false);

        $query = $this->Playlists
                ->findVisible($this->Auth->user('id'))
                ->limit(1)
                ->hydrate(false)
                ->where([
            'Playlists.id' => $id,
        ]);
        $data = $query->first();
        if (empty($data)) {
            throw new \Cake\Network\Exception\NotFoundException();
        }
        ResultMessage::overwriteData($data);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add() {
        ResultMessage::setWrapper(true);
        if ($this->request->is('post')) {
            $playlist = $this->Playlists->newEntity($this->request->data);
            $playlist->user_id = $this->Auth->user('id');
            if ($this->Playlists->save($playlist)) {
                ResultMessage::setMessage("Playlist created", true);
                ResultMessage::setData('playlist_id', $playlist->id);
                return;
            }
            ResultMessage::addValidationErrorsModel($playlist);
        }
        ResultMessage::setMessage("Cannot create this playlist", false);
    }

    /**
     * Edit method
     *
     * @param string|null $id Playlist id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null) {
        ResultMessage::setWrapper(true);
        if ($this->request->is('post')) {
            $playlist = $this->Playlists->getEditabled($id, $this->Auth->user('id'));
            $this->Playlists->patchEntity($playlist, $this->request->data);
            if ($this->Playlists->save($playlist)) {
                ResultMessage::setMessage("Playlist saved", true);
                return;
            }
            ResultMessage::addValidationErrorsModel($playlist);
        }
        ResultMessage::setMessage("Cannot save this playlist", false);
    }

    /**
     * Delete method
     *
     * @param string|null $id Playlist id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null) {
        $this->request->allowMethod(['post', 'delete']);
        $playlist = $this->Playlists->getEditabled($id, $this->Auth->user('id'));
        if ($this->Playlists->delete($playlist)) {
            ResultMessage::setMessage('This playlist has been successfully removed', true);
        } 
    }

    
    public function trending(){
        ResultMessage::setWrapper(false);
        $query = $this->Playlists->findTrending();
        ResultMessage::overwriteData($query->all());
    }
}
