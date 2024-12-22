<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class QuizEventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return[
            'id' =>  $this->resource->id,
            'name' => $this->resource->name,
            'start_date_time' => $this->start_date_time,
            'season' => new SeasonResource($this->resource->season),
            'moderator' => new UserResource($this->resource->user)
        ];
    }
}
