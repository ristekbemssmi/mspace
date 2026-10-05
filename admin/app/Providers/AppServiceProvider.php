<?php

namespace App\Providers;

use App\Models\Birdept;
use App\Models\Faq;
use App\Models\Informasi;
use App\Models\User;
use App\Policies\BirdeptPolicy;
use App\Policies\FaqPolicy;
use App\Policies\InformasiPolicy;
use App\Policies\UserPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Birdept::class, BirdeptPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Informasi::class, InformasiPolicy::class);
        Gate::policy(Faq::class, FaqPolicy::class);
        Gate::define('access-admin', fn (User $user): bool => $user->hasAdminRole('admin', 'editor', 'viewer'));

        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
