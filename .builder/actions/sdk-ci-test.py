import atexit
import Builder
import os
import subprocess

class SdkCiTest(Builder.Action):

    def _build_and_run_eventstream_echo_server(self, env):
        java_sdk_dir = None

        try:
            env.shell.exec(["mvn", "--version"], check=True)

            # maven is installed, so this is a configuration we can start an event stream echo server
            java_sdk_dir = env.shell.mktemp()

            env.shell.exec(["git", "clone", "https://github.com/aws/aws-iot-device-sdk-java-v2"], working_dir=java_sdk_dir, check=True)

            sdk_dir = os.path.join(java_sdk_dir, "aws-iot-device-sdk-java-v2", "sdk")
            env.shell.pushd(sdk_dir)

            try:
                # The EchoTest server is in test-only code
                env.shell.exec(["mvn", "test-compile"], check=True)

                env.shell.exec(["mvn", "dependency:build-classpath", "-Dmdep.outputFile=classpath.txt"], check=True)

                with open('classpath.txt', 'r') as file:
                    classpath = file.read()

                test_class_path = os.path.join(sdk_dir, "target", "test-classes")
                target_class_path = os.path.join(sdk_dir, "target", "classes")
                directory_separator = os.pathsep

                echo_server_command = ["java", "-classpath", f"{test_class_path}{directory_separator}{target_class_path}{directory_separator}{classpath}", "software.amazon.awssdk.eventstreamrpc.echotest.EchoTestServiceRunner", "127.0.0.1", "8033"]

                print(f'Echo server command: {echo_server_command}')

                # bypass builder's exec wrapper since it doesn't allow for background execution
                proc = subprocess.Popen(echo_server_command)

                @atexit.register
                def _terminate_echo_server():
                    proc.terminate()
                    proc.wait()

                env.shell.setenv("AWS_TEST_EVENT_STREAM_ECHO_SERVER_HOST", "127.0.0.1", quiet=False)
                env.shell.setenv("AWS_TEST_EVENT_STREAM_ECHO_SERVER_PORT", "8033", quiet=False)
            finally:
                env.shell.popd()

        except:
            print('Failed to set up event stream server.  Eventstream CI tests will not be run.')

        return java_sdk_dir

    def run(self, env):

        actions = []
        java_sdk_dir = None

        try:
            java_sdk_dir = self._build_and_run_eventstream_echo_server(env)

            env.shell.exec(["npm", "run", "test"], check=True)
        except:
            print(f'Failure while running tests')
            actions.append("exit 1")
        finally:
            if java_sdk_dir:
                env.shell.rm(java_sdk_dir)

        return Builder.Script(actions, name='sdk-ci-test')
