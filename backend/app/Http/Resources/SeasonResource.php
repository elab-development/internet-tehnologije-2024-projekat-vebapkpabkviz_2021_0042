<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SeasonResource extends JsonResource
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
            'start_date' => $this->resource->start_date,
            'end_date' => $this->resource->end_date
        ];
    }
}
