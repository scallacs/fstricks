<?php

namespace App\Controller;
use App\Controller\AppController;
use App\Lib\ResultMessage;
/**
 * VideoTagAccuracyRates Controller
 *
 * @property \App\Model\Table\VideoTagAccuracyRatesTable $VideoTagAccuracyRates
 */
class VideoTagAccuracyRatesController extends AppController {

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function fake() {
        $this->add(\App\Model\Entity\VideoTagAccuracyRate::VALUE_FAKE);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function accurate() {
        $this->add(\App\Model\Entity\VideoTagAccuracyRate::VALUE_ACCURATE);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    private function add($value) {
        ResultMessage::setWrapper(true);
        if ($this->request->is('post')) {
            $videoTagAccuracyRate = $this->VideoTagAccuracyRates->newEntity($this->request->data);
            $videoTagAccuracyRate->user_id = $this->Auth->user('id');
            $videoTagAccuracyRate->value = $value;
            $videoTagAccuracyRate->isNew(true); 

            if ($this->VideoTagAccuracyRates->save($videoTagAccuracyRate, ['checkExisting' => false])) {
                ResultMessage::setMessage(__('Your rate has been saved.'), true);
                ResultMessage::overwriteData([
                    'count_fake' => $videoTagAccuracyRate->videoTag->count_fake,
                    'count_accurate' => $videoTagAccuracyRate->videoTag->count_accurate,
                    'status' => $videoTagAccuracyRate->videoTag->status
                ]);
            } else {
                ResultMessage::setMessage(__('Cannot add your rate for now. Please try again later.'), false);
            }
        }
    }

}
