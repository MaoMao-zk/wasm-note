#include "thread.h"
#include <pthread.h>
#include <stdio.h>
#include <time.h>

bool running = false;
pthread_t thread_id = 0;
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
clock_t start = 0;

int running_time = 0;

void* thread_process(void*)
{
    running = true;
    printf("thread started.\n");

    start = clock();
    clock_t current;

    while(running)
    {
        pthread_mutex_lock(&mutex);
        current = clock();
        running_time = (current - start) / (CLOCKS_PER_SEC/1000);
        pthread_mutex_unlock(&mutex);
    }

    printf("thread end.\n");
    return nullptr;
}


void start_thread()
{
    printf("start_thread called.\n");
    if(running)
        return;
    
    running_time = 0;

    pthread_attr_t attr;
	pthread_attr_init(&attr);
	pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_DETACHED);
	pthread_attr_setstacksize(&attr, 1048576);
    
    int ret = 0;
	if ( (ret = pthread_create((pthread_t*)&thread_id, &attr, thread_process, nullptr)) != 0)
	{
        perror("pthread_create failed.\n");
		pthread_attr_destroy(&attr);
		return;
	}

	pthread_attr_destroy(&attr); 
}

void stop_thread()
{
    running = false;
    running_time = 0;
}


void lock_thread()
{
    pthread_mutex_lock(&mutex);
}

void unlock_thread()
{
    pthread_mutex_unlock(&mutex);
}