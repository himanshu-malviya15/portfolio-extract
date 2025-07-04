<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('video_url')->nullable();
            $table->text('thumbnail_url')->nullable();
            $table->timestamps();
            
            $table->index('client_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};