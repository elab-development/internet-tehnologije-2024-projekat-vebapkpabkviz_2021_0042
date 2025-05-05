<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'username' => $this->resource->username,
            'email' => $this->resource->email,
            'full_name' => $this->resource->full_name,
            'role' => $this->resource->role,
            'team' => new TeamResource($this->resource->team) 
        ];
    }
}
