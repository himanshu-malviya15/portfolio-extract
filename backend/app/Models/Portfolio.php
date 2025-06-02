<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_url',
        'status',
        'scraped_data'
    ];

    protected $casts = [
        'scraped_data' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }
}