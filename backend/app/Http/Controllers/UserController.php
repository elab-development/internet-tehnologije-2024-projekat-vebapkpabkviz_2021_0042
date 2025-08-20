<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();

        if (!$users) {
            return response()->json(['message' => 'Users not found'], 404);
        }

        return response()->json(['data' => UserResource::collection($users)], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'full_name' => 'required|string|max:255',
            'role' => 'string|in:admin,contestant,moderator',
            'team_id' => 'integer'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());
        }

        try {
            $user = new User();
            $user->username = $request->username;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->full_name = $request->full_name;

            if($request->role!=null){
                $user->role = $request->role;
            } else{
                $user->role = 'contestant';
            }

            if($request->team_id!=null){
                $user->team_id = $request->team_id;
            }

            $user->save();
        } 
        catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['data' => new UserResource($user)], 201);


    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['data' => new UserResource($user)], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'string|max:255',
            'email' => 'string|email|max:255',
            'password' => 'string|min:8',
            'full_name' => 'string|max:255',
            'role' => 'in:admin,contestant,moderator',
            'team_id' => 'integer'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        try {
            $user->update($request->all());
        } 
        catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['data' => new UserResource($user)], 200);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        try {
            $user->delete();
        } 
        catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['message' => 'User deleted'], 204);
    }
}
