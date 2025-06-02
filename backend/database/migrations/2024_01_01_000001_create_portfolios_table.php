<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
Schema::create('portfolios', function (Blueprint $table) {
    $table->id();
    $table->string('portfolio_url', 500); // This line was missing
    $table->enum('status', ['processing', 'completed', 'failed'])->default('processing');
    $table->json('scraped_data')->nullable();
    $table->timestamps();
    
    $table->index('portfolio_url');
    $table->index('status');
});
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};