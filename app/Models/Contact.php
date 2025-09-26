<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    /** @use HasFactory<\Database\Factories\ContactFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'phone_number',
        'user_id',
    ];

    public function users(){
        return $this->belongsTo(User::class);
    }

    public function groups(){
        return $this->belongsToMany(Group::class);
    }
}
