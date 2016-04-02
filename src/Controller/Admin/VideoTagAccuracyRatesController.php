<?php
namespace App\Controller;

use App\Lib\ResultMessage;
/**
 * VideoTagAccuracyRates Controller
 *
 * @property \App\Model\Table\VideoTagAccuracyRatesTable $VideoTagAccuracyRates
 */
class VideoTagAccuracyRatesController extends AppController
{

    /**
     * Index method
     *
     * @return void
     */
    public function index()
    {
        $this->paginate = [
            'contain' => ['Users', 'VideoTags']
        ];
        $this->set('videoTagAccuracyRates', $this->paginate($this->VideoTagAccuracyRates));
        $this->set('_serialize', ['videoTagAccuracyRates']);
    }

    /**
     * View method
     *
     * @param string|null $id Video Tag Accuracy Rate id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null)
    {
        $videoTagAccuracyRate = $this->VideoTagAccuracyRates->get($id, [
            'contain' => ['Users', 'VideoTags']
        ]);
        $this->set('videoTagAccuracyRate', $videoTagAccuracyRate);
        $this->set('_serialize', ['videoTagAccuracyRate']);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $videoTagAccuracyRate = $this->VideoTagAccuracyRates->newEntity();
        if ($this->request->is('post')) {
            $videoTagAccuracyRate = $this->VideoTagAccuracyRates->patchEntity($videoTagAccuracyRate, $this->request->data);
            if ($this->VideoTagAccuracyRates->save($videoTagAccuracyRate)) {
                $this->Flash->success(__('The video tag accuracy rate has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The video tag accuracy rate could not be saved. Please, try again.'));
            }
        }
        $users = $this->VideoTagAccuracyRates->Users->find('list', ['limit' => 200]);
        $videoTags = $this->VideoTagAccuracyRates->VideoTags->find('list', ['limit' => 200]);
        $this->set(compact('videoTagAccuracyRate', 'users', 'videoTags'));
        $this->set('_serialize', ['videoTagAccuracyRate']);
    }

    /**
     * Edit method
     *
     * @param string|null $id Video Tag Accuracy Rate id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null)
    {
        $videoTagAccuracyRate = $this->VideoTagAccuracyRates->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $videoTagAccuracyRate = $this->VideoTagAccuracyRates->patchEntity($videoTagAccuracyRate, $this->request->data);
            if ($this->VideoTagAccuracyRates->save($videoTagAccuracyRate)) {
                $this->Flash->success(__('The video tag accuracy rate has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The video tag accuracy rate could not be saved. Please, try again.'));
            }
        }
        $users = $this->VideoTagAccuracyRates->Users->find('list', ['limit' => 200]);
        $videoTags = $this->VideoTagAccuracyRates->VideoTags->find('list', ['limit' => 200]);
        $this->set(compact('videoTagAccuracyRate', 'users', 'videoTags'));
        $this->set('_serialize', ['videoTagAccuracyRate']);
    }

    /**
     * Delete method
     *
     * @param string|null $id Video Tag Accuracy Rate id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $videoTagAccuracyRate = $this->VideoTagAccuracyRates->get($id);
        if ($this->VideoTagAccuracyRates->delete($videoTagAccuracyRate)) {
            $this->Flash->success(__('The video tag accuracy rate has been deleted.'));
        } else {
            $this->Flash->error(__('The video tag accuracy rate could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }
}
